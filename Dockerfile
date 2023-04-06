FROM node:19-alpine3.16
ENV MONGO_HOST=mongo
ENV REDIS_HOST=redis
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm cache clean --force && rm -rf node_modules && npm install
COPY . .
CMD ["node", "server.js"]
EXPOSE 3000
