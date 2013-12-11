module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TeamWorkers', {
        team_id: DataTypes.INTEGER,
        employee_id: DataTypes.INTEGER
    }, {
        tableName: 'teamworkers'
    });
};
