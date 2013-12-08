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

//SELECT *, (fullTime.eid is not null) as isFullTime FROM `employees` as e, `fulltimes` as fullTime, `parttimes` as partTime WHERE e.eid = fullTime.eid OR e.eid = partTime.eid

// SELECT distinct e.eid, f.eid, p.eid FROM `employees` as e, `fulltimes` as f, `parttimes` as p
// WHERE e.eid IN (select f.eid from `fulltimes` as f where e.eid = f.eid)
// OR e.eid IN (select p.eid from `parttimes` as p where e.eid = p.eid)
