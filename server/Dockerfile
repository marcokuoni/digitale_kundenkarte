FROM node:latest
WORKDIR /usr/src/app

ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

CMD ["npm", "rebuild", "bcrypt", "--build-from-source"]

CMD ["npm","run","dev"]
