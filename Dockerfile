FROM node:6.9.5-alpine

COPY . /usr/app
WORKDIR /usr/app

RUN npm install

EXPOSE 3001

CMD npm start
