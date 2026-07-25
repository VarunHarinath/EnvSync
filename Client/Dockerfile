FROM --platform=amd64 node:22-alpine AS Builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

FROM --platform=amd64 nginx:alpine

COPY --from=Builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173