//const cv = require('opencv4nodejs');

const express = require('express')
const app = express()

//var accessToken = '23612221.3fcb46b.348431486f3a4fb85081d5242db9ca1c';
//var InstagramAPI = require('instagram-api');
//var instagramAPI = new InstagramAPI(accessToken);

app.get('/', function (req, res) {
  res.send('Hello World')
})


app.listen(3000)

console.log("hello");
