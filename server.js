var sqlConnector = require('./mysql_connector_sequelize').init(),
	express = require('express'),
	app = express();

sqlConnector.query("SELECT * FROM testtable1").success(function(myTableRows) {
    console.log(myTableRows);
});

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(3000);
console.log('Listening on port 3000');