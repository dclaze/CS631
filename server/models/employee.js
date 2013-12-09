module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Employee', {
        eid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ename: DataTypes.TEXT,
        title: DataTypes.TEXT,
        phone: DataTypes.TEXT,
        dept: DataTypes.TEXT
    });
};