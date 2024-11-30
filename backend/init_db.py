from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float

# Konfiguracja SQLAlchemy dla SQLite
DATABASE_URL = "sqlite:///ai_doctor_db.sqlite"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False, "timeout": 30})
metadata = MetaData()

# Definicja tabeli 'lab_tests'
lab_tests = Table(
    'lab_tests', metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String, nullable=False),
    Column('min_value', Float, nullable=False),
    Column('max_value', Float, nullable=False),
    Column('unit', String, nullable=False)
)

# Tworzenie tabeli
metadata.create_all(engine)

# Dodawanie danych do tabeli
try:
    with engine.begin() as conn:
        # Usunięcie istniejących danych
        conn.execute(lab_tests.delete())

        # Dodanie nowych danych
        conn.execute(lab_tests.insert().values([
            {"name": "Profil lipidowy", "min_value": 0.5, "max_value": 1.5, "unit": "mmol/L"},
            {"name": "Poziom glukozy", "min_value": 3.9, "max_value": 5.5, "unit": "mmol/L"},
            {"name": "Witamina D", "min_value": 50, "max_value": 125, "unit": "nmol/L"},
            {"name": "Cholesterol", "min_value": 3.5, "max_value": 5.2, "unit": "mmol/L"},
            {"name": "Kreatynina", "min_value": 62, "max_value": 115, "unit": "µmol/L"},
            {"name": "AST", "min_value": 5, "max_value": 40, "unit": "U/L"},
            {"name": "Bilirubina", "min_value": 0.1, "max_value": 1.2, "unit": "mg/dL"},
            {"name": "Albumina", "min_value": 3.5, "max_value": 5.0, "unit": "g/dL"},
            {"name": "Żelazo", "min_value": 60, "max_value": 170, "unit": "µg/dL"},
            {"name": "Wapń całkowity", "min_value": 8.5, "max_value": 10.2, "unit": "mg/dL"},
            {"name": "TSH", "min_value": 0.4, "max_value": 4.0, "unit": "µIU/mL"},
            {"name": "FT4", "min_value": 0.8, "max_value": 1.8, "unit": "ng/dL"},
            {"name": "Kwas moczowy", "min_value": 3.5, "max_value": 7.2, "unit": "mg/dL"},
            {"name": "Cholesterol całkowity", "min_value": 0, "max_value": 200, "unit": "mg/dL"},
            {"name": "Cholesterol HDL", "min_value": 40, "max_value": 60, "unit": "mg/dL"},
            {"name": "Triglicerydy", "min_value": 0, "max_value": 150, "unit": "mg/dL"},
            {"name": "LDL", "min_value": 0, "max_value": 100, "unit": "mg/dL"},
            {"name": "Hemoglobina", "min_value": 12, "max_value": 18, "unit": "g/dL"},
            {"name": "Erytrocyty", "min_value": 4.5, "max_value": 5.9, "unit": "mln/µL"},
            {"name": "Leukocyty", "min_value": 4.0, "max_value": 11.0, "unit": "tys/µL"},
            {"name": "Płytki krwi", "min_value": 150, "max_value": 450, "unit": "tys/µL"}
        ]))
    print("Database initialized with test data.")
except Exception as e:
    print(f"Error while initializing database: {str(e)}")