angular.module('sampleApp')
    .controller('EmployeeGridController', function($scope, $http, $modal, $rootScope) {
        $scope.employee = {};
        $scope.employeeCreatedError = "";

        $scope.onCreateEmployeeClick = function() {
            $modal.open({
                templateUrl: 'source/humanResources/views/createEmployee.html',
                backdrop: true,
                windowClass: 'modal',
                controller: function($scope, $modalInstance, employee) {
                    $scope.employee = employee.id ? employee : {};
                    $scope.selection = 'fullTime';
                    $scope.fullTime = {};
                    $scope.partTime = {};
                    $scope.submit = function() {
                        $http({
                            method: 'POST',
                            url: '/createEmployee/',
                            data: {
                                employee: $scope.employee,
                                fullTime: $scope.fullTime,
                                isFullTime: $scope.fullTime.salary && $scope.fullTime.startDate, //TODO: Use active switch
                                partTime: $scope.partTime
                            }
                        }).success(function(data, status, headers, config) {
                            $modalInstance.dismiss('cancel');
                            loadEmployees();
                            $rootScope.$emit('employeeCreated',data);
                        }).error(function(data, status, headers, config) {
                            $scope.employeeCreatedError = data;
                        });

                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    employee: function() {
                        return $scope.employee;
                    }
                }
            });
        };

        $scope.onRefeshEmployeesGridClick = function(){
            loadEmployees();
        }

        $scope.filterOptions = {
            filterText: ''
        };

        var loadEmployees = function() {
            $http({
                method: 'GET',
                url: '/employees'
            }).success(function(data, status, headers, config) {
                $scope.myData = data;
            }).error(function(data, status, headers, config) {
                console.error("Server returned status ", status, data);
            });
        };

        $scope.gridOptions = {
            data: 'myData',
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'eid',
                displayName: 'Id'
            }, {
                field: 'ename',
                displayName: 'Name'
            }, {
                field: 'employmentStatus',
                displayName: 'Employment Status'
            }]
        };

        loadEmployees();
    });;
