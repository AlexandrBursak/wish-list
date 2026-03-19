FROM node:20-alpine

WORKDIR /app

# Install root deps
COPY package.json ./
RUN npm install --production

# Install server deps
COPY server/package.json ./server/
RUN cd server && npm install --production

# Install client deps & build
COPY client/package.json client/vite.config.js ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Copy server code
COPY server/ ./server/
COPY .env.production ./.env

EXPOSE 3001

CMD ["node", "server/index.js"]
