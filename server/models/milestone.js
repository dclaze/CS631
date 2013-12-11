module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Milestone', {
        project_id: DataTypes.INTEGER,
        name: DataTypes.TEXT,
        description: DataTypes.TEXT,
    },{
    	tableName: 'milestone'
    });
};