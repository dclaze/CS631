var q = require('q');

var calculateTaxForSalary = function(salary, percentage) {
    return (salary / 12) * (percentage / 100);
};
var calculateTaxForHourly = function(hourlyRate, durationInHours, percentage) {
    return hourlyRate * durationInHours * (percentage / 100);
};

var padMonth = function(month) {
    return (month + "").length == 1 ? month : "0" + month;
}

var salaryHistoryQueryBuilder = function(year, month) {
    var beginningOfMonth = function(year, month) {
        return [year, padMonth(month), '01'].join("-");
    };
    var endOfMonth = function(year, month) {
        var day = new Date(year, month + 1, '0').getUTCDate();
        return [year, month, day].join("-");
    };

    var fullTimeEmployeeSalaryHistory = ["SELECT F.eid, E.ename, F.title_start_date, F.SALARY AS current_salary, SH.SALARY AS paid_salary, SH.paid_date, SH.month, SH.year, SH.fed_tax, SH.state_tax, SH.other_tax, (SH.EID IS NOT NULL) AS isPaid",
        " FROM FULLTIMES F",
        " LEFT JOIN SALARY_HISTORIES SH ON SH.EID = F.EID",
        " AND ((STR_TO_DATE(CONCAT(SH.YEAR,LPAD(SH.MONTH,2,'0'),'01'),'%Y%m%d') BETWEEN '" + beginningOfMonth(year, month) + "' AND '" + endOfMonth(year, month) + "') OR SH.SALARY IS NULL)",
        " LEFT JOIN EMPLOYEES E ON F.EID = E.EID", " WHERE E.EID IS NOT NULL AND F.TITLE_START_DATE <='" + endOfMonth(year, month) + "'"
    ].join("");
    return fullTimeEmployeeSalaryHistory;
};

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
            console.log(processedHistoryItems);
            deferred.resolve(processedHistoryItems);
        })
        .error(function(error) {
            deferred.reject(error);
        });
    return deferred.promise;
}

var salaryHistoryMapping = function(dateEntered, month, year, salaryDTO) {
    return {
        eid: salaryDTO.eid,
        ssn: salaryDTO.ssn,
        paid_date: dateEntered,
        month: padMonth(month),
        year: year,
        salary: salaryDTO.salary,
        fed_tax: salaryDTO.federalTax,
        state_tax: salaryDTO.stateTax,
        other_tax: salaryDTO.otherTax
    };
};

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


var hourlyHistoryQueryBuilder = function(year, month) {
    var beginningOfMonth = function(year, month) {
        return [year, padMonth(month), '01'].join("-");
    };
    var endOfMonth = function(year, month) {
        var day = new Date(year, month + 1, '0').getUTCDate();
        return [year, month, day].join("-");
    };
    var partTimeHourlyWageHistory = ["SELECT P.eid, E.ename, P.hour_rate AS current_rate, HH.hour_rate as paid_rate, P.duration,HH.fed_tax, HH.state_tax, HH.other_tax,p.START_DATE, P.END_DATE,HH.paid_date,(HH.EID IS NOT NULL) AS isPaid",
        " FROM PARTTIMES P",
        " LEFT JOIN HOURLY_HISTORIES HH ON HH.EID = P.EID",
        " LEFT JOIN EMPLOYEES E ON E.EID = P.EID",
        " WHERE  P.END_DATE BETWEEN '", beginningOfMonth(year, month), "' AND '", endOfMonth(year, month), "'"
    ].join("");
    return partTimeHourlyWageHistory;
};

var getHourlyWagesForMonth = function(sqlConnector, year, month) {
    var deferred = q.defer();
    var query = hourlyHistoryQueryBuilder(year, month);
    sqlConnector.query(query)
        .success(function(historyItems) {
            console.log(historyItems);
            var processedHistoryItems = historyItems.map(function(historyItem) {
                var duration = historyItem.duration || 0,
                    hourlyWage = historyItem.paid_rate || historyItem.current_rate,
                    beforeTax = calculateTaxForHourly(hourlyWage, duration, 100),
                    federalTax = historyItem.fed_tax || calculateTaxForHourly(hourlyWage, duration, 10),
                    stateTax = historyItem.state_tax || calculateTaxForHourly(hourlyWage, duration, 5),
                    otherTax = historyItem.other_tax || calculateTaxForHourly(hourlyWage, duration, 3),
                    afterTax = beforeTax - federalTax - stateTax - otherTax;

                return {
                    eid: historyItem.eid,
                    ename: historyItem.ename,
                    hour_rate: hourlyWage,
                    duration: duration,
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
};


var hourlyWageHistoryMapping = function(dateEntered, hourlyWageDTO) {
    return {
        eid: hourlyWageDTO.eid,
        ssn: hourlyWageDTO.ssn,
        paid_date: dateEntered,
        hour_rate: hourlyWageDTO.hour_rate,
        duration: hourlyWageDTO.duration,
        fed_tax: hourlyWageDTO.federalTax,
        state_tax: hourlyWageDTO.stateTax,
        other_tax: hourlyWageDTO.otherTax
    };
};

var payHourlyWages = function(hourlyModel, hourlyWages) {
    var deferred = q.defer();
    hourlyModel.bulkCreate(hourlyWages)
        .success(function(enteredHourlyWages) {
            deferred.resolve(enteredHourlyWages);
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

    app.get('/hourlyWages', function(request, response) {
        var sqlConnector = app.get('sequelize');
        var dateStr = request.query.date,
            date = new Date(JSON.parse(dateStr)),
            month = date.getUTCMonth(),
            year = date.getUTCFullYear();

        response.send(getHourlyWagesForMonth(sqlConnector, year, month + 1));
    });

    app.post('/payHourlyWages', function(request, response) {
        var hourlyWagesToPay = request.body.hourlyWages,
            date = request.body.dateEntered,
            hourlyWages = [];

        for (var i = 0; i < hourlyWagesToPay.length; i++)
            hourlyWages.push(hourlyWageHistoryMapping(date, hourlyWagesToPay[i]))

        var hourlyHistoryModel = request.app.get('models').hourly_history;
        response.send(payHourlyWages(hourlyHistoryModel, hourlyWages));
    });
};
