FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY public/fonts ./public/fonts

RUN npm install --legacy-peer-deps

COPY . .

ENV AUTH_SERVICE_URL=https://comin.kaveeshagimhana.com

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
