var Sequelize = require('sequelize-mysql').sequelize;
var config = require('./config').init().mysql;

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port || 3306,
    dialect: 'mysql'
});

sequelize.query("SELECT * FROM testtable1").success(function(myTableRows) {
    console.log(myTableRows);
});
