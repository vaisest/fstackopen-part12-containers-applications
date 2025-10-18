FROM node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --omit=dev

USER node

ENTRYPOINT ["npm", "start"]