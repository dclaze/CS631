var q = require('q');

var calculateTaxForSalary = function(salary, percentage){
    return (salary/12) * (pertange/100);
}
var calculateTaxForHourly = function(hourlyRate, durationInHours, percentage){
    return hourlyRate * durationInHours * (percentage/100);
}

var FullTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `FULLTIMES` as F " + "WHERE E.EID = F.EID";
var PartTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `PARTTIMES` as P " + "WHERE E.EID = P.EID";

var getEmployees = function(sqlConnector) {
    var deferred = promises.defer();

    sqlConnector.query(FullTimeEmployeesQuery)
        .success(function(fullTimeEmployees) {
            sqlConnector.query()
                .success(function(partTimeEmployees) {
                    var employees = fullTimeEmployees.concat(partTimeEmployees);
                    deferred.resolve(employees.map(function(employee) {
                        return {
                            eid: employee.eid,
                            ename: employee.ename,
                            employmentStatus: employee.title_start_date ? 'Full Time' : 'Part Time'
                        }
                    }));
                })
                .error(function(error) {
                    deferred.reject(error);
                });
        })
        .failure(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

module.exports = function(app) {
    app.get('/salaries', function(request, response) {
        // var employeeModel = request.app.get('models').employee;
        // addInitialEmployees(employeeModel);
        // response.end();
    });
};

//Load all full time employees and what they should get paid for the month