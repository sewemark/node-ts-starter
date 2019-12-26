FROM node:12

WORKDIR /app 

COPY package.json package.json

COPY . /app

RUN yarn install

EXPOSE 8082

RUN yarn global add nodemon 

CMD [ "nodemon", "dist/index.js" ]
