from flask import Flask, request, jsonify
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import openai
from flask_cors import CORS

# Wczytanie zmiennych środowiskowych z pliku .env
load_dotenv()

# Konfiguracja SQLAlchemy i OpenAI
DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

engine = create_engine(DATABASE_URL, echo=True)  # echo=True umożliwia logowanie SQL w celu debugowania
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

# Inicjalizacja aplikacji Flask
app = Flask(__name__)
CORS(app)  # Dodanie obsługi CORS

# Odbicie struktury tabel z bazy danych
metadata.reflect(bind=engine)

try:
    lab_tests = metadata.tables['lab_tests']
except KeyError:
    raise ValueError("Table 'lab_tests' not found in the database.")

@app.route("/reference-data", methods=["GET"])
def get_reference_data():
    try:
        # Otwarcie sesji
        with SessionLocal() as session:
            test_name = request.args.get('test_name')
            print(f"Request for test_name: {test_name}")

            # Pobranie rekordu na podstawie nazwy testu
            stmt = select(lab_tests.c.name, lab_tests.c.min_value, lab_tests.c.max_value, lab_tests.c.unit).where(lab_tests.c.name == test_name)
            result = session.execute(stmt).fetchone()

            if result:
                # `result` jest krotką, więc używamy indeksów liczbowych, a nie kluczy znakowych
                response = {
                    "name": result[0],
                    "min_value": result[1],
                    "max_value": result[2],
                    "unit": result[3]
                }
                return jsonify(response)
            else:
                return jsonify({"error": f"Test not found for: {test_name}"}), 404

    except Exception as e:
        # Logowanie szczegółowego błędu
        print(f"Error during reference data retrieval: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/available-tests", methods=["GET"])
def get_available_tests():
    try:
        # Otwarcie sesji
        with SessionLocal() as session:
            # Utworzenie zapytania
            stmt = select(lab_tests.c.name)
            results = session.execute(stmt).fetchall()

            # Ponieważ `results` jest listą krotek, musimy użyć indeksów liczbowych, aby uzyskać dostęp do wartości
            available_tests = [row[0] for row in results]

            return jsonify({"tests": available_tests})

    except Exception as e:
        print(f"Error during fetching available tests: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/analyze-with-gpt", methods=["POST"])
def analyze_with_gpt():
    try:
        # Odczytanie danych z żądania
        data = request.get_json()
        text_to_analyze = data.get("text", "")

        if not text_to_analyze:
            return jsonify({"error": "No text provided for analysis"}), 400

        # Wywołanie API OpenAI w celu analizy tekstu
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Jesteś ekspertem medycznym i udzielasz szczegółowych analiz w języku polskim."},
                {"role": "user", "content": f"Proszę przeanalizować poniższe wyniki badań:\n{text_to_analyze}"}
            ],
            max_tokens=500,  # Zwiększamy max_tokens na 500 (możesz dopasować do potrzeb)
            temperature=0.7
        )

        # Pobranie tekstu odpowiedzi od GPT
        analysis = response['choices'][0]['message']['content'].strip()

        # Zwrócenie odpowiedzi z analizą
        return jsonify({"analysis": analysis})

    except Exception as e:
        print(f"Error during GPT analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
