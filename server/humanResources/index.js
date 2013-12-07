var Sequelize = require('sequelize'),
    promises = require('q');

// var getEmployees = function() {
//     var deferred = promises.defer();

//     sqlConnector.query("SELECT * FROM " + tableName)
//         .success(function(myTableRows) {
//             console.log(myTableRows);
//             deferred.resolve(myTableRows);
//         })
//         .failure(function(error) {
//             deferred.reject(error);
//         });

//     return deferred.promise;
// };

var getEmployees = function(employeeModel) {
    var deferred = promises.defer();

    employeeModel.findAll()
        .success(function(myTableRows) {
            deferred.resolve(myTableRows);
        })
        .failure(function(error) {
            deferred.reject(error);
        });

    return deferred.promise;
}

var addInitialEmployees = function(employeeModel) {
    employeeModel.bulkCreate([{
        eid: 1,
        ename: 'Doug Colaizzo',
        project: 'Big Bridge Project',
        title: 'Manager',
        building_name: 'MLK',
        office_number: 45,
        phone: '201 953 1983'
    }, {
        eid: 2,
        ename: 'Heather',
        project: 'Contruct Monument of Doug',
        title: 'Boss',
        building_name: 'Headquarters',
        office_number: 1,
        phone: '123456789'
    }, {
        eid: 3,
        ename: 'Michal',
        project: 'Caldwell Highway',
        title: 'Manager',
        building_name: 'Bloomfield Ave.',
        office_number: 2,
        phone: '987654321'
    }, ]).success(function() {
        employeeModel.findAll().success(function(employees) {
            console.log(employees);
        });
    });
};

var createEmployee = function(employeeModel, employeeParams){
    employeeModel.create(employeeParams);
}

module.exports = function(app, database) {
    app.get('/createInitialEmployeeData', function(request, response){
        var employeeModel = request.app.get('models').employee;
        addInitialEmployees(employeeModel);
        response.end();
    });

    app.post('/createEmployee', function(request, response) {
        var employeeModel = request.app.get('models').employee;
        var employee = request.body.employee,
            fullTime = request.body.fullTime,
            partTime = request.body.partTime;

        console.log(employee, fullTime, partTime);
        // createEmployee(employeeModel, request.body);
    });

    app.get('/employees', function(request, response) {
        var employeeModel = request.app.get('models').employee;
        response.json(getEmployees(employeeModel));
    });
};
