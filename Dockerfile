FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/uploads

RUN npm run build

RUN chmod -R 755 /app/uploads

CMD [ "npm", "run", "start" ]
