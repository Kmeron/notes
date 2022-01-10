FROM node:16-alpine as img1
ENV NODE_ENV production
RUN mkdir notes-server
WORKDIR notes-server
COPY server server
WORKDIR server 
RUN npm ci
CMD node index.js

FROM node:16-alpine as img2
RUN mkdir notes-app
WORKDIR notes-app
COPY client client 
WORKDIR client
RUN npm ci
CMD ["npm", "start"]