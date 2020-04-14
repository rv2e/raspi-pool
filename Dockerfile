# Install dependencies independently not to expose NPM_TOKEN in the build history
FROM arm32v6/node:12.16.2-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache --virtual .gyp python make g++

COPY package.json .
COPY yarn.lock .

RUN yarn install --network-timeout 1000000

COPY . .

RUN touch .env

RUN NODE_OPTIONS=--max_old_space_size=512 yarn build

ENV PORT 3000
EXPOSE 3000

CMD ["sh", "-c", "yarn start:prod"]
