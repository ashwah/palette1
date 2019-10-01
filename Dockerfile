FROM node:10.16.3

ENV HOME=/home/app

COPY package.json $HOME/palette1/

WORKDIR $HOME/palette1
RUN npm install

CMD ["node", "index.js"]
