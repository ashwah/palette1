const express = require('express');
const app = express();

const kmeans = require('node-kmeans');
const getPixels = require("get-pixels");

const mysql = require('mysql');

const db = require('./app/database/datatbase_layer');

//var accessToken = '23612221.3fcb46b.348431486f3a4fb85081d5242db9ca1c';
//var InstagramAPI = require('instagram-api');
//var instagramAPI = new InstagramAPI(accessToken);

const img = "img2.jpg";

app.get('/', function (req, res) {
  doEverything(img).then(function(centroids) {
    var markup = '';
    var r, g, b;
    for (var centroid in centroids) {

      r = centroids[centroid][0];
      g = centroids[centroid][1];
      b = centroids[centroid][2];

      markup += '<div style="background-color:rgb(' + r + ', ' + g + ', ' + b + ' )">HELLO</div></br>';
    }
    res.send(markup);
  });
})

app.get('/db', function (req, res) {
  db.insertImage().then(function (result) {
    res.send(result);
  }).catch(function (err) {
    console.log(err);
  });
  // console.log('Hello ' + process.env.MYSQL_USERNAME)
  // var con = mysql.createConnection({
  //   host: process.env.MYSQL_HOST,
  //   database: process.env.MYSQL_DB,
  //   user: process.env.MYSQL_USERNAME,
  //   password: process.env.MYSQL_PASSWORD
  // });
  //
  // con.connect(function(err) {
  //   if (err) throw err;
  //   con.query("SELECT * FROM MyGuests", function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
  //     res.send(result);
  //   });
  // });

})

app.listen(3000);

/**
 * Promisified getPixels function.
 *
 * Attempts to load an image from the path.
 *
 * @param img
 * @returns {Promise<unknown>}
 */
function getImagePixels(img) {
  return new Promise(function (resolve) {
    getPixels(img, function(err, pixels) {
      if(err) {
        console.log("Bad image path")
        return
      }
      resolve(pixels);
    })
  })
}

/**
 * Preprocess the image pixels.
 *
 * Filter based on some HSL parmeters.
 *
 * @param pixels
 * @returns {Promise<[]>}
 */
async function preprocessPixels(pixels) {
  var out = [];
  for (var i = 0; i < pixels.shape[0]; i++) {
    for (var j = 0; j < pixels.shape[1]; j++) {
      var r = pixels.get(i,j,0);
      var g = pixels.get(i,j,1);
      var b = pixels.get(i,j,2);
      hsl = rgbToHsl(r,g,b);
      if (hsl[1] > 0.3 && hsl[2] < 0.8 && hsl[2] > 0.2) {
        out.push([r, g, b]);
      }
    }
  }
  return Promise.resolve(out);
}

/**
 * Apply the clustering k-means algorithm.
 *
 * @param out
 * @returns {Promise<unknown>}
 */
function cluster(out) {
  return new Promise(function (resolve) {
    let centroids = [];
    kmeans.clusterize(out, {k: 10}, (err,res) => {
      console.log('clustering');
      if (err) console.error(err);
      else
      //console.log('%o',res);

        for (var result in res) {
          //console.log('xxxxx' + res[result].centroid);
          centroids.push(res[result].centroid);
        }
        resolve(centroids);
    });
  })
}

/**
 * Combine the proceeding async functions.
 *
 * @param img
 * @returns {Promise<unknown>}
 */
async function doEverything(img) {
  var pixels = await getImagePixels(img);
  var output = await preprocessPixels(pixels);
  var centroids = await cluster(output);

  return Promise.resolve(centroids);
}

/**
 * Convert RGB to HSL.
 *
 * @param r
 * @param g
 * @param b
 * @returns {[number, number, number]}
 */
function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}
