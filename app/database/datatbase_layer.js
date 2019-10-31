const mysql = require('mysql');

module.exports = {
  insertImage
}

function getConnection() {

  var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  });

  return Promise.resolve(con);

}


async function insertImage() {
  var con = await getConnection();


  return new Promise(function (resolve, reject) {

    con.connect(function(err) {
      if (err) reject(err);

      con.query("SELECT * FROM MyGuests", function (err, result, fields) {
        if (err) reject(err);

        console.log(result);
        resolve(result);
      });
    });
  });

}
