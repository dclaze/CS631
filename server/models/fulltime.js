module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Fulltime', {
        eid: DataTypes.INTEGER,
        salary: DataTypes.INTEGER,
        title: DataTypes.TEXT,
        title_start_date: DataTypes.DATE
    });
};
