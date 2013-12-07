module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Employee', {
        eid: DataTypes.INTEGER,
        ename: DataTypes.TEXT,
        project: DataTypes.TEXT,
        title: DataTypes.TEXT,
        building_name: DataTypes.TEXT,
        office_number: DataTypes.INTEGER,
        phone: DataTypes.TEXT
    });
};
