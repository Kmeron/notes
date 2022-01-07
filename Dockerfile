FROM node:16-alpine
ENV NODE_ENV production
RUN mkdir notes
WORKDIR notes
COPY server server
WORKDIR server 
RUN npm ci
CMD node index.js