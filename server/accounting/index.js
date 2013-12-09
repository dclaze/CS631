var q = require('q');

var calculateTaxForSalary = function(salary, percentage) {
    return (salary / 12) * (percentage / 100);
};
var calculateTaxForHourly = function(hourlyRate, durationInHours, percentage) {
    return hourlyRate * durationInHours * (percentage / 100);
};

var FullTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `FULLTIMES` as F " + "WHERE E.EID = F.EID";

var getUnpaidSalaries = function(sqlConnector) {
    var deferred = q.defer();
    sqlConnector.query(FullTimeEmployeesQuery)
        .success(function(fullTimeEmployees) {
            var fullTimeEmployeesWithSalaryInfo = fullTimeEmployees.map(function(employee) {
                var beforeTax = calculateTaxForSalary(employee.salary, 100),
                    federalTax = calculateTaxForSalary(employee.salary, 10),
                    stateTax = calculateTaxForSalary(employee.salary, 5),
                    otherTax = calculateTaxForSalary(employee.salary, 3),
                    afterTax = beforeTax - federalTax - stateTax - otherTax;

                return {
                    eid: employee.eid,
                    ename: employee.ename,
                    title_start_date: employee.title_start_date,
                    salary: employee.salary,
                    federalTax: federalTax,
                    stateTax: stateTax,
                    otherTax: otherTax,
                    beforeTax: beforeTax,
                    afterTax: afterTax
                };
            });
            deferred.resolve(fullTimeEmployeesWithSalaryInfo);
        })
        .failure(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

module.exports = function(app) {
    app.get('/salaries', function(request, response) {
        var sqlConnector = app.get('sequelize');
        var dateStr = request.query.date,
            date = new Date(JSON.parse(date));

        response.send(getUnpaidSalaries(sqlConnector));
    });
    app.post('/paySalaries', function(request, response) {
        var salariesToPay = request.body;
        console.log(salariesToPay);
    });
};
