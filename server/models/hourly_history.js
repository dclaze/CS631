module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Hourly_History', {
        eid:  DataTypes.INTEGER,
        ssn: DataTypes.TEXT,
        paid_date: DataTypes.DATE,
        hour_rate: DataTypes.INTEGER,
        duration: DataTypes.INTEGER,
        fed_tax: DataTypes.INTEGER,
        state_tax: DataTypes.INTEGER,
        other_tax: DataTypes.INTEGER
    });
};