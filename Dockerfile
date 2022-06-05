# Based on: https://medium.com/@VincentSchoener/development-of-nodejs-application-with-docker-and-typescript-part-2-4dd51c1e7766

### Start of Compilation-Container
FROM node:18.2.0-alpine AS builder
RUN apk add --no-cache python3 py3-pip
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

COPY tsconfig*.json ./
COPY ./src ./src

RUN npm install -g node-pre-gyp

RUN npm ci --quiet --include=dev && npm run build
### End of Compilation-Container

### Start of Production-Container
FROM node:18.2.0-alpine
RUN apk add --no-cache python3 py3-pip


WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g node-pre-gyp


# This has to be adapted if the distro of the base image changes.
# RUN apk add  --no-cache ffmpeg
# apt install ffmpeg


COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --quiet --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

COPY .env ./

CMD ["node", "/app/dist/app.js"]