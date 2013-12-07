var mysqlSequelize = require('sequelize-mysql').sequelize;

var sequelize = {
    init: function(config) {
        return new mysqlSequelize(config.database, config.username, config.password, {
            host: config.host,
            port: config.port || 3306,
            dialect: 'mysql'
        });
    }
}

module.exports = sequelize;