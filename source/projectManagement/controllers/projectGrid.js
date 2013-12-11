angular.module('sampleApp')
    .controller('ProjectController', ['$scope', '$modal', '$http', '$rootScope', 'teamsService', 'projectsService',
        function($scope, $modal, $http, $rootScope, teamsService, projectsService) {
            $scope.onCreateProjectClick = function() {
                $modal.open({
                    templateUrl: 'source/projectManagement/views/createProject.html',
                    backdrop: true,
                    windowClass: 'modal',
                    controller: function($scope, $modalInstance) {
                        $scope.project = {};
                        $scope.teamsView = teamsService.getTeamsGridView();
                        $scope.submit = function() {
                            $http({
                                method: 'POST',
                                url: '/createProject',
                                data: {
                                    projectName: $scope.project.projectName,
                                    teamId: $scope.project.team.tid,
                                    managerId: $scope.project.team.managerId,
                                    departmentId: $scope.project.departmentId,
                                    startDate: $scope.project.startDate,
                                    endDate: $scope.project.endDate,
                                    budget: $scope.project.budget * 1000
                                }
                            }).success(function(data, status, headers, config) {
                                $modalInstance.dismiss('cancel');
                                loadProjectGrid()
                                $rootScope.$emit('projectCreated', data);
                            }).error(function(data, status, headers, config) {
                                $scope.projectCreateError = data;
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            };

            var formatDate = function(date) {
                return date ? new Date(date).toLocaleDateString() : ""
            };

            var loadProjectGrid = function() {
                $http({
                    method: 'GET',
                    url: '/projects'
                }).success(function(data, status, headers, config) {
                    var formattedData = data.map(function(item) {
                        var mappedItem = item;
                        mappedItem.start_date = formatDate(mappedItem.start_date);
                        mappedItem.end_date = formatDate(mappedItem.end_date);
                        return mappedItem;
                    })
                    $scope.projectData = data;
                }).error(function(data, status, headers, config) {
                    console.error("Server returned status ", status, data);
                });
            };

            var showProjectDetails = function(row) {
                $modal.open({
                    templateUrl: 'source/projectManagement/views/viewProject.html',
                    backdrop: true,
                    windowClass: 'modal',
                    controller: function($scope, $modalInstance) {
                        $scope.projectName = row.pname;
                        $scope.employeeCount = projectsService.getNumberOfEmployees(row.pid);

                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            };

            $scope.selectedRow = [];
            $scope.gridOptions = {
                data: 'projectData',
                filterOptions: $scope.filterOptions,
                multiSelect: false,
                selectedItems: $scope.selectedRow,
                afterSelectionChange: function(data) {
                    var row = $scope.selectedRow[0]
                    if (typeof(row) !== "undefined")
                        showProjectDetails(row);
                },
                columnDefs: [{
                    field: 'pid',
                    displayName: 'Id'
                }, {
                    field: 'pname',
                    displayName: 'Name'
                }, {
                    field: 'manager_id',
                    displayName: 'Manager Id'
                }, {
                    field: 'budget',
                    displayName: 'Budget'
                }, {
                    field: 'start_date',
                    displayName: 'Start'
                }, {
                    field: 'end_date',
                    displayName: 'End'
                }, {
                    field: 'department_id',
                    displayName: 'Department Id'
                }]
            };

            loadProjectGrid();
        }
    ]);
