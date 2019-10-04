# TODO Change this base image, Opencv not needed.
FROM justadudewhohacks/opencv-nodejs:node9-opencv3.4.1-contrib

WORKDIR /app

COPY ./package.json /app/
RUN npm install -g nodemon && npm install

#CMD ["node", "index.js"]
