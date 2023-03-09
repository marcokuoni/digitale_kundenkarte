FROM node:latest
WORKDIR /usr/src/app

# COPY package*.json .
# COPY tsconfig*.json ./

# # RUN npm install -g npm@9.6.0
# RUN npm install --silent

# COPY . .

ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

# RUN npm run build

# RUN rm -rf ./dist/schemas
# RUN mkdir -p ./dist/schemas
# COPY ./src/schemas ./dist/schemas

# ENV NODE_PATH="./dist"

CMD ["npm","run","dev"]