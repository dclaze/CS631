var promises = require('q');

var createEmployeeMapping = function(createEmployeeDTO) {
    var employee = createEmployeeDTO.employee
    return {
        ename: employee.name,
        title: employee.title,
        phone: employee.phoneNumber,
        dept: 'Test Dept'
    };
};

var fullTimeEmployeeMapping = function(createEmployeeDTO) {
    var employee = createEmployeeDTO.employee,
        fullTime = createEmployeeDTO.fullTime;

    return {
        salary: fullTime.salary,
        title: employee.title,
        title_start_date: fullTime.startDate
    };
};

var partTimeEmployeeMapping = function(createEmployeeDTO) {
    var employee = createEmployeeDTO.employee,
        partTime = createEmployeeDTO.partTime;

    return {
        hour_rate: partTime.hourlyRate,
        job_title: employee.title,
        duration: partTime.duration,
        start_date: partTime.startDate,
        end_date: partTime.endDate
    };
};

var FullTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `FULLTIMES` as F " + "WHERE E.EID = F.EID";
var PartTimeEmployeesQuery = "SELECT * " + "FROM `EMPLOYEES` as E, `PARTTIMES` as P " + "WHERE E.EID = P.EID";

var getEmployees = function(sqlConnector) {
    var deferred = promises.defer();

    sqlConnector.query(FullTimeEmployeesQuery)
        .success(function(fullTimeEmployees) {
            sqlConnector.query(PartTimeEmployeesQuery)
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
        .error(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

// var getEmployees = function(employeeModel) {
//     var deferred = promises.defer();

//     employeeModel.findAll()
//         .success(function(myTableRows) {
//             deferred.resolve(myTableRows);
//         })
//         .failure(function(error) {
//             deferred.reject(error);
//         });

//     return deferred.promise;
// };

var addInitialEmployees = function(employeeModel) {
    employeeModel.bulkCreate([{
        ename: 'Doug Colaizzo',
        title: 'Manager',
        phone: '201 953 1983',
        dept: 'Gorillas'
    }, {
        ename: 'Heather',
        title: 'Boss',
        phone: '123456789',
        dept: 'Gorillas'
    }, {
        ename: 'Michal',
        title: 'Manager',
        phone: '987654321',
        dept: 'Gorillas'
    }, ]).success(function() {
        employeeModel.findAll().success(function(employees) {
            console.log(employees);
        });
    });
};

//Alternate syntax to create
// Task
//   .build({ title: 'foo', description: 'bar', deadline: new Date() })
//   .save()

var createFullTimeEmployee = function(employeeModel, employee, fullTimeModel, fullTime) {
    var deferred = promises.defer();
    employeeModel.create(employee)
        .success(function(employee) {
            fullTime.eid = employee.eid;
            fullTimeModel.create(fullTime)
                .success(function() {
                    deferred.resolve("Successfully created full time employee " + employee.ename);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
        })
        .error(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

var createPartTimeEmployee = function(employeeModel, employee, partTimeModel, partTime) {
    var deferred = promises.defer();
    employeeModel.create(employee)
        .success(function(employee) {
            partTime.eid = employee.eid;
            partTimeModel.create(partTime)
                .success(function() {
                    deferred.resolve("Successfully created part time employee " + employee.ename);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
        })
        .error(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
};

module.exports = function(app, database) {
    app.get('/createInitialEmployeeData', function(request, response) {
        var employeeModel = request.app.get('models').employee;
        addInitialEmployees(employeeModel);
        response.end();
    });

    app.post('/createEmployee', function(request, response) {
        var employeeModel = request.app.get('models').employee;
        var employee = createEmployeeMapping(request.body),
            isFullTime = request.body.isFullTime,
            result;

        if (isFullTime) {
            var fullTime = fullTimeEmployeeMapping(request.body),
            result = createFullTimeEmployee(employeeModel, employee, request.app.get('models').fulltime, fullTime);
        } else {
            var partTime = partTimeEmployeeMapping(request.body),
            result = createPartTimeEmployee(employeeModel, employee, request.app.get('models').parttime, partTime);
        }

        response.send(result);
    });

    app.get('/employees', function(request, response) {
        var sqlConnector = request.app.get('sequelize');

        response.json(getEmployees(sqlConnector));
    });
};
