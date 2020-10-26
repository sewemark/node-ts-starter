
#****************** BASE *******************#
FROM node:12-slim as base

ENV NODE_ENV=production

EXPOSE 8081

WORKDIR /app

COPY package*.json ./

RUN npm ci \
    && npm cache clean --force

ENV PATH=/app/node_modules/.bin:$PATH

#****************** DEV *******************#
FROM base as dev

ENV NODE_ENV=development

RUN npm config list

RUN apt-get update -qq && apt-get install -qy \ 
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends

RUN npm install --only=development \
    && npm cache clean --force

CMD ["/app/node_modules/.bin/nodemon"]



#****************** TEST *******************#
FROM dev as test

COPY . .


#****************** BUILD *******************#

FROM test as build

RUN tsc


#****************** PRE-PROD *******************#


FROM build as pre-prod 

RUN rm -rf ./tests && rm -rf ./node_modules



#****************** PROD *******************#

FROM pre-prod as prod

COPY --from=pre-prod /app/dist/ .

CMD ["node", "app/dist/index.js"]

HEALTHCHECK --interval=5s --timeout=3s --start-period=15s \
    CMD curl -f http://127.0.0.1/healthcheck || exit 1
