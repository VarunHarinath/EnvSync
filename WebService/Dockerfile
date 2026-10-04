FROM node:22-alpine AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY package.json index.js app.js config.js ./
COPY db ./db
COPY lib ./lib
COPY middleware ./middleware
COPY routes ./routes
COPY Services ./Services
COPY cli ./cli
COPY mcp ./mcp

EXPOSE 8080

USER node

CMD ["node", "index.js"]
