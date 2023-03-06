FROM node:latest
WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

# RUN npm install -g npm@9.6.0
RUN npm install --silent

COPY ./src ./src
COPY ./public ./public

RUN npm run-script build


ENV PORT=3001
ENV HOST=0.0.0.0

CMD [ "npm", "start" ]