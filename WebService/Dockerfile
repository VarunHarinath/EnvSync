FROM --platform=amd64 node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "--import", "./Utilities/instrument.js", "index.js"]
