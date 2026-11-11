FROM node:22-alpine

WORKDIR /app

RUN npm install -g @ionic/cli http-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8100

CMD ["npx", "serve", "-s", "www", "-l", "8100"]