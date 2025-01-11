FROM node:22-alpine

WORKDIR /var/www

RUN mkdir -p /var/www/src
COPY ./src /var/www/src
COPY ./.env /var/www/.env

COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

ENV NODE_ENV=production

COPY --chmod=755 <<EOT /entrypoint.sh
#!/usr/bin/env sh
set -e
npm install --omit=dev
npm start
EOT

ENTRYPOINT ["/entrypoint.sh"]
