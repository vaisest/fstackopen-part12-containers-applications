FROM node AS build-stage
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
ARG REACT_APP_GQL_URL
ARG REACT_APP_GQL_WS_URL
ENV REACT_APP_GQL_URL=${REACT_APP_GQL_URL}
ENV REACT_APP_GQL_WS_URL=${REACT_APP_GQL_WS_URL}
RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /app/build /usr/share/nginx/html