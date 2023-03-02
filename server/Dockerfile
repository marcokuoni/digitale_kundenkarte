FROM node:latest
ENV NODE_ENV production
ENV LISTEN_PORT=3003
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install -g npm@9.6.0
RUN npm install --production --silent
COPY . .
CMD npm start