FROM node:22-alpine

WORKDIR /app

RUN npm install -g @ionic/cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8100

# Pinalitan natin ito para direkta nang tawagin ang Angular CLI at i-bypass ang host check
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "8100", "--disable-host-check", "--poll", "1000"]