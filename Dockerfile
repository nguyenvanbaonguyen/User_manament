FROM node:19-alpine3.16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
CMD ["node", "server.js"]
EXPOSE 3000
