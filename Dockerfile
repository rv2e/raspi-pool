# Install dependencies independently not to expose NPM_TOKEN in the build history
FROM arm32v6/node:12.16.2-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --network-timeout 1000000

COPY . .

RUN touch .env

RUN yarn build

ENV PORT 3000
EXPOSE 3000

CMD ["bash", "-c", "yarn start:prod"]
