module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Parttime', {
        eid: DataTypes.INTEGER,
        hour_rate: DataTypes.INTEGER,
        job_title: DataTypes.TEXT,
        duration: DataTypes.INTEGER
    });
};
