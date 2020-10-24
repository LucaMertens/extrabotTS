FROM jrottenberg/ffmpeg:4.1-scratch AS ffmpeg
FROM node:12
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=ffmpeg / /
COPY package*.json ./
RUN npm install --also=dev

COPY . .
CMD ["npm", "start"]
