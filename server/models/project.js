module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Project', {
        pid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pname: DataTypes.TEXT,
        manager_id: DataTypes.INTEGER,
        budget: DataTypes.INTEGER,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        department_id: DataTypes.INTEGER
    }, {
        tableName: 'project'
    });
};