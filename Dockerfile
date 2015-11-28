FROM node:4.2

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 7199 7000 7001 9160 9042

CMD ["node", "server.js"]
