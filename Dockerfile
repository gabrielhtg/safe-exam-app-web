FROM alpine:latest
LABEL authors="ta-12"

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]