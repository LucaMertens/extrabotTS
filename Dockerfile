FROM node:12
ENV NODE_ENV=production
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install --also=dev

COPY . .
CMD ["npm", "start"]
