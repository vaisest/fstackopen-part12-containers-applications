FROM node
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
ENV GQL_URL=http://localhost:4000
CMD ["npm", "start"]