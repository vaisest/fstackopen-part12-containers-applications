FROM node

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]