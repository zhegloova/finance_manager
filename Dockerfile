FROM node:18-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm install
COPY client/ .
RUN npm run build

FROM node:18-alpine as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm install
COPY server/ .

FROM node:18-alpine
WORKDIR /app

COPY --from=client-builder /app/client/dist ./client/dist

COPY --from=server-builder /app/server ./server

WORKDIR /app/server
RUN npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm install --production

ENV NODE_ENV=production
ENV PORT=5001
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

EXPOSE 5001

CMD ["node", "src/index.js"] 