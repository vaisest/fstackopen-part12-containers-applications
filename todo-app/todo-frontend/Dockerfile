FROM node AS build-stage 

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# https://github.com/docker/compose/issues/5600
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN env=test npm test
RUN npm run build


FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html