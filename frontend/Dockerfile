# Użycie oficjalnego obrazu Node.js jako obrazu bazowego
FROM node:14

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie plików projektu do obrazu
COPY . /app

# Instalacja zależności Node.js
RUN npm install

# Budowanie aplikacji
RUN npm run build

# Serwowanie aplikacji za pomocą serwera npm serve
RUN npm install -g serve

# Otwórz port dla serwera frontendu
EXPOSE 3000

# Uruchomienie serwera, aby zbudowana aplikacja była dostępna na porcie 3000
CMD ["serve", "-s", "build"]