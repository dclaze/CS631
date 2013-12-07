angular.module('sampleApp')
    .controller('EmployeeGridController', function($scope, $http, $modal) {
        $scope.employee = {};
        $scope.employeeCreatedError = "";

        $scope.onCreateEmployeeClick = function() {
            $modal.open({
                templateUrl: 'source/humanResources/views/createEmployee.html',
                backdrop: true,
                windowClass: 'modal',
                controller: function($scope, $modalInstance, employee) {
                    $scope.employee = employee;
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
                                partTime: $scope.partTime
                            }
                        }).success(function(data, status, headers, config) {
                            $modalInstance.dismiss('cancel');
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

        $scope.filterOptions = {
            filterText: ''
        };

        $http({
            method: 'GET',
            url: '/showTable/',
            params: {
                tableName: 'testtable1'
            }
        }).success(function(data, status, headers, config) {
            $scope.myData = data;
        }).error(function(data, status, headers, config) {
            console.error("Server returned status ", status, data);
        });

        $scope.gridOptions = {
            data: 'myData',
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'id',
                displayName: 'Id'
            }, {
                field: 'name',
                displayName: 'Name'
            }]
        };
    });;
