FROM node:latest
WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

# RUN npm install -g npm@9.6.0
RUN npm install --silent

COPY ./src ./src
COPY ./public ./public

RUN npm run-script build

ARG CLIENT_PORT
ENV PORT=${CLIENT_PORT}
ARG CLIENT_HOST_IP
ENV HOST=${CLIENT_HOST_IP}

CMD [ "npm", "start" ]