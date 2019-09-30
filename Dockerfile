FROM node:10.16.3

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/palette1/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/palette1
RUN npm install

