FROM node:16-alpine3.12

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "run" ,"dev"]