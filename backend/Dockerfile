# Użycie oficjalnego obrazu Python jako obrazu bazowego
FROM python:3.9-slim

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie plików backendu do obrazu
COPY . /app

# Instalacja zależności Python
RUN pip install --no-cache-dir -r requirements.txt

# Otwórz port aplikacji Flask
EXPOSE 5000

# Polecenie uruchomienia aplikacji
CMD ["python", "main.py"]