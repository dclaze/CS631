module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Salary_History', {
        eid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ssn: DataTypes.TEXT,
        paid_date: DataTypes.DATE,
        month: DataTypes.INTEGER,
        year: DataTypes.INTEGER,
        salary: DataTypes.TEXT,
        fed_tax: DataTypes.INTEGER,
        state_tax: DataTypes.INTEGER,
        other_tax: DataTypes.INTEGER
    });
};