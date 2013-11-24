angular.module('sampleApp')
    .controller('EmployeeGridController', function($scope, $http, $modal) {
        $scope.employee = {};

        $scope.onCreateEmployeeClick = function() {
            $modal.open({
                templateUrl: 'views/humanResources/createEmployee.html',
                backdrop: true,
                windowClass: 'modal',
                controller: function($scope, $modalInstance, employee) {
                    $scope.employee = employee;
                    $scope.submit = function() {
                        alert("Submitting Employee" + JSON.stringify($scope.employee));
                        $modalInstance.dismiss('cancel');
                    }
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
