FROM node

WORKDIR /app

COPY . /app

CMD ["node", "census.js"]