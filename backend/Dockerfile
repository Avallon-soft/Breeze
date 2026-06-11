FROM node:latest AS frontend
LABEL authors="matth"

#create app directory and use it as default directory in docker image
WORKDIR /app

#copy package.json and install dependency
COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]