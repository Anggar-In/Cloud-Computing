# Gunakan image Node.js
FROM node:22

# Tetapkan working directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh file ke container
COPY . .

# Ekspos port untuk aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
