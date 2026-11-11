FROM node:22-alpine

WORKDIR /app

# Idinagdag natin ang 'serve' dito para naka-install na siya agad
RUN npm install -g @ionic/cli http-server serve

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8100

# Gagamitin natin yung naka-install nang 'serve' (walang 'npx')
CMD ["serve", "-s", "www", "-l", "8100"]