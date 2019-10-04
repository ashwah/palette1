const express = require('express');
const app = express();

//var accessToken = '23612221.3fcb46b.348431486f3a4fb85081d5242db9ca1c';
//var InstagramAPI = require('instagram-api');
//var instagramAPI = new InstagramAPI(accessToken);

var centroids = [];
var markup = '';

app.get('/', function (req, res) {
  for (var centroid in centroids) {

    var r = centroids[centroid][0];
    var g = centroids[centroid][1];
    var b = centroids[centroid][2];

    markup += '<div style="background-color:rgb(' + r + ', ' + g + ', ' + b + ' )">HELLO</div></br>';

  }
  res.send(markup);
})

app.listen(3000);

var getPixels = require("get-pixels");

getPixels("img2.jpg", function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  console.log(pixels.shape);

  var out = [];
  for (var i = 0; i < pixels.shape[0]; i++) {
    for (var j = 0; j < pixels.shape[1]; j++) {
      var r = pixels.get(i,j,0);
      var g = pixels.get(i,j,1);
      var b = pixels.get(i,j,2);
      hsl = rgbToHsl(r,g,b);
      console.log(hsl);
      if (hsl[1] > 0.3 && hsl[2] < 0.8 && hsl[2] > 0.2) {
        out.push([r, g, b]);
      }
    }
  }

  const kmeans = require('node-kmeans');
  kmeans.clusterize(out, {k: 10}, (err,res) => {
    console.log('clustering');
    if (err) console.error(err);
    else
      //console.log('%o',res);

      for (var result in res) {
        centroids.push(res[result].centroid);
      }

  });
})


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
