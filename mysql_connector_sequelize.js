var Sequelize = require('sequelize-mysql').sequelize;

var sequelize = new Sequelize("test", "node_server", "cs631", {
    host: 'cs631fp-mysql.hopto.org',
    port: 3306,
    dialect: 'mysql'
});

sequelize.query("SELECT * FROM testtable1").success(function(myTableRows) {
    console.log(myTableRows);
});
