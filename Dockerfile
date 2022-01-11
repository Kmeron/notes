FROM node:16-alpine 
ENV NODE_ENV production
RUN mkdir notes-server
WORKDIR notes-server
COPY server server
COPY ./client/build client/build
WORKDIR server 
RUN npm ci
CMD node index.js
