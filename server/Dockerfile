FROM node:latest
WORKDIR /usr/src/app

COPY package*.json ./
# RUN npm install -g npm@9.6.0
RUN npm install --silent

COPY . .

ARG SERVER_PORT
ENV LISTEN_PORT=${SERVER_PORT}

CMD [ "npm", "start" ]