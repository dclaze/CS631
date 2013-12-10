module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Parttime', {
        eid: DataTypes.INTEGER,
        hour_rate: DataTypes.INTEGER,
        job_title: DataTypes.TEXT,
        duration: DataTypes.INTEGER,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE
    });
};
// SELECT P.eid, E.ename, P.start_date, SH.month, SH.year, SH.fed_tax, SH.state_tax, SH.other_tax, (SH.EID IS NOT NULL) AS isPaid
// FROM PARTTIMES P
// LEFT JOIN SALARY_HISTORIES SH ON SH.EID = F.EID
// LEFT JOIN EMPLOYEES E ON F.EID = E.EID AND((STR_TO_DATE(CONCAT(SH.YEAR,SH.MONTH,'01'),'%Y%m%d') BETWEEN '2013-12-1' AND '2013-12-31') OR SH.SALARY IS NULL)
// WHERE E.EID IS NOT NULL AND F.TITLE_START_DATE <='2013-12-31'



// SELECT P.eid, E.ename, (HH.EID IS NOT NULL) AS isPaid
// FROM PARTTIMES P
// LEFT JOIN HOURLY_HISTORIES HH ON HH.EID = P.EID
// LEFT JOIN EMPLOYEES E ON P.EID = E.EID AND((STR_TO_DATE(CONCAT(SH.YEAR,SH.MONTH,'01'),'%Y%m%d') BETWEEN '2013-12-1' AND '2013-12-31') OR HH.PAID_DATE IS NULL)
// WHERE E.EID IS NOT NULL AND P.START_DATE <='2013-12-31'