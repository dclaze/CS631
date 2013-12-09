var q = require('q');

var calculateTaxForSalary = function(salary, percentage) {
    return (salary / 12) * (percentage / 100);
};
var calculateTaxForHourly = function(hourlyRate, durationInHours, percentage) {
    return hourlyRate * durationInHours * (percentage / 100);
};

var salaryHistoryQueryBuilder = function(year, month) {
    var beginningOfMonth = function(year, month) {
        return [year, month, '1'].join("-");
    };
    var endOfMonth = function(year, month) {
        var day = new Date(year, month + 1, '0').getUTCDate();
        return [year, month, day].join("-");
    };
    console.log(beginningOfMonth(year, month));
    console.log(endOfMonth(year, month));
    var fullTimeEmployeeSalaryHistory = ["SELECT F.eid, E.ename, F.title_start_date, F.SALARY AS current_salary, SH.SALARY AS paid_salary, SH.paid_date, SH.month, SH.year, SH.fed_tax, SH.state_tax, SH.other_tax, (SH.EID IS NOT NULL) AS isPaid", " FROM FULLTIMES F", " LEFT JOIN SALARY_HISTORIES SH ON SH.EID = F.EID", " LEFT JOIN EMPLOYEES E ON F.EID = E.EID AND ((STR_TO_DATE(CONCAT(SH.YEAR,SH.MONTH,'01'),'%Y%m%d') BETWEEN '" + beginningOfMonth(year, month) + "' AND '" + endOfMonth(year, month) + "') OR SH.SALARY IS NULL)", " WHERE E.EID IS NOT NULL AND F.TITLE_START_DATE <='" + endOfMonth(year, month) + "'"].join("");
    return fullTimeEmployeeSalaryHistory;
}

var getSalaryHistoryForMonth = function(sqlConnector, year, month) {
    var deferred = q.defer();
    var query = salaryHistoryQueryBuilder(year, month);
    sqlConnector.query(query)
        .success(function(historyItems) {
            var processedHistoryItems = historyItems.map(function(historyItem) {
                var salary = historyItem.paid_salary || historyItem.current_salary,
                    beforeTax = calculateTaxForSalary(salary, 100),
                    federalTax = historyItem.fed_tax || calculateTaxForSalary(salary, 10),
                    stateTax = historyItem.state_tax || calculateTaxForSalary(salary, 5),
                    otherTax = historyItem.other_tax || calculateTaxForSalary(salary, 3),
                    afterTax = beforeTax - federalTax - stateTax - otherTax;

                return {
                    eid: historyItem.eid,
                    ename: historyItem.ename,
                    title_start_date: historyItem.title_start_date,
                    salary: salary,
                    paid_date: historyItem.paid_date,
                    beforeTax: beforeTax,
                    federalTax: federalTax,
                    stateTax: stateTax,
                    otherTax: otherTax,
                    afterTax: afterTax
                };
            });
            deferred.resolve(processedHistoryItems);
        })
        .error(function(error) {
            deferred.reject(error);
        });
    return deferred.promise;
}

// var FullTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `FULLTIMES` as F " + "WHERE E.EID = F.EID";
// var getUnpaidSalaries = function(sqlConnector) {
//     var deferred = q.defer();
//     sqlConnector.query(FullTimeEmployeesQuery)
//         .success(function(fullTimeEmployees) {
//             var fullTimeEmployeesWithSalaryInfo = fullTimeEmployees.map(function(employee) {
//                 var beforeTax = calculateTaxForSalary(employee.salary, 100),
//                     federalTax = calculateTaxForSalary(employee.salary, 10),
//                     stateTax = calculateTaxForSalary(employee.salary, 5),
//                     otherTax = calculateTaxForSalary(employee.salary, 3),
//                     afterTax = beforeTax - federalTax - stateTax - otherTax;

//                 return {
//                     eid: employee.eid,
//                     ename: employee.ename,
//                     title_start_date: employee.title_start_date,
//                     salary: employee.salary,
//                     federalTax: federalTax,
//                     stateTax: stateTax,
//                     otherTax: otherTax,
//                     beforeTax: beforeTax,
//                     afterTax: afterTax
//                 };
//             });
//             deferred.resolve(fullTimeEmployeesWithSalaryInfo);
//         })
//         .failure(function(error) {
//             deferred.reject(error);
//         });

//     return deferred.promise;
// };

var salaryHistoryMapping = function(dateEntered, month, year, salaryDTO) {
    return {
        eid: salaryDTO.eid,
        ssn: salaryDTO.ssn,
        paid_date: dateEntered,
        month: month,
        year: year,
        salary: salaryDTO.salary,
        fed_tax: salaryDTO.federalTax,
        state_tax: salaryDTO.stateTax,
        other_tax: salaryDTO.otherTax
    };
}

var paySalaries = function(salaryModel, salaries) {
    var deferred = q.defer();
    salaryModel.bulkCreate(salaries)
        .success(function(enteredSalaries) {
            deferred.resolve(enteredSalaries);
        })
        .error(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

module.exports = function(app) {
    app.get('/salaries', function(request, response) {
        var sqlConnector = app.get('sequelize');
        var dateStr = request.query.date,
            date = new Date(JSON.parse(dateStr)),
            month = date.getUTCMonth(),
            year = date.getUTCFullYear();

        response.send(getSalaryHistoryForMonth(sqlConnector, year, month + 1));
    });

    app.post('/paySalaries', function(request, response) {
        var salariesToPay = request.body.salariesToPay,
            date = request.body.dateEntered,
            month = request.body.month,
            year = request.body.year,
            salaryHistory = [];

        for (var i = 0; i < salariesToPay.length; i++)
            salaryHistory.push(salaryHistoryMapping(date, month + 1, year, salariesToPay[i]))

        var salaryHistoryModel = request.app.get('models').salary_history;
        response.send(paySalaries(salaryHistoryModel, salaryHistory));
    });
};
