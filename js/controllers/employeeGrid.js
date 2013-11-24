angular.module('sampleApp')
    .controller('EmployeeGridController', function($scope, $http, createDialog) {
        $scope.onCreateEmployeeClick = function($event, data) {
            createDialog('views/humanResources/createEmployee.html', {
                id: 'createEmployee',
                title: 'Create Employee',
                backdrop: true,
                success: {
                    label: 'Create',
                    fn: function() {
                        console.log('Simple modal closed');
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
