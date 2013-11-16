var sqlConnector = require('./mysql_connector_sequelize').init(),
    express = require('express'),
    app = express(),
    promises = require('q');

app.use(require('express-promise')());

showTableHandler = function(tableName) {
    var deferred = promises.defer();

    sqlConnector.query("SELECT * FROM " + tableName)
        .success(function(myTableRows) {
            console.log(myTableRows);
            deferred.resolve(myTableRows);
        })
        .failure(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
}


app.get('/showTable/:tableName', function(request, response) {
    var tableName = request.params.tableName
    response.json(showTableHandler(tableName));
});

app.listen(3000);
