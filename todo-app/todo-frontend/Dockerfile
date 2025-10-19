FROM node AS build-stage 

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV VITE_BACKEND_URL="http://localhost:3000/"
RUN env=test npm test
RUN npm run build


FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html