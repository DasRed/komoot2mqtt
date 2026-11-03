FROM node:26-alpine

ENV NODE_ENV=production

WORKDIR /var/www

COPY ./src /var/www/src
COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

RUN npm ci --omit=dev

CMD ["npm", "start"]
