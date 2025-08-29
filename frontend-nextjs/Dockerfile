FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build & run
RUN npm run build
CMD ["npm", "start"]
