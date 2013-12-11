module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Team', {
        tid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        tname: DataTypes.TEXT,
        project_id: DataTypes.INTEGER,
        person_hrs: DataTypes.INTEGER,
        manager_id: DataTypes.INTEGER
    }, {
        tableName: 'team'
    });
};
