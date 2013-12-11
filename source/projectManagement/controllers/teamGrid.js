angular.module('sampleApp')
    .controller('TeamController', ['$scope', '$modal', '$http', 'employeesService', '$rootScope',
        function($scope, $modal, $http, employeesService, $rootScope) {
            $scope.onCreateTeamClick = function() {
                $modal.open({
                    templateUrl: 'source/projectManagement/views/createTeam.html',
                    backdrop: true,
                    windowClass: 'modal',
                    controller: function($scope, $modalInstance) {
                        $scope.team = {};

                        $scope.employees = employeesService.getEmployees();
                        $scope.submit = function() {
                            $http({
                                method: 'POST',
                                url: '/createTeam',
                                data: {
                                    teamName: $scope.team.name,
                                    employeeIds: $scope.team.employeeIds,
                                    managerId: $scope.team.managerId
                                }
                            }).success(function(data, status, headers, config) {
                                $modalInstance.dismiss('cancel');
                                loadTeamGrid()
                                $rootScope.$emit('teamCreated', data);
                            }).error(function(data, status, headers, config) {
                                $scope.teamCreateError = data;
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            };

            var loadTeamGrid = function() {
                $http({
                    method: 'GET',
                    url: '/teams'
                }).success(function(data, status, headers, config) {
                    $scope.teamData = data;
                }).error(function(data, status, headers, config) {
                    console.error("Server returned status ", status, data);
                });
            };

            $rootScope.$on('projectCreated', function() {
                loadTeamGrid();
            });

            $scope.gridOptions = {
                data: 'teamData',
                filterOptions: $scope.filterOptions,
                columnDefs: [{
                    field: 'tid',
                    displayName: 'Id'
                }, {
                    field: 'tname',
                    displayName: 'Name'
                }, {
                    field: 'projectName', //Transform to Project Name
                    displayName: 'Project'
                }, {
                    field: 'managerName', //Transform to Employee Name
                    displayName: 'Manager'
                }]
            };

            loadTeamGrid();
        }
    ]);
