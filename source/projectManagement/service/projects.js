angular.module('sampleApp')
    .factory('projectsService', ['$q', '$http',
        function($q, $http) {
            return {
                getNumberOfEmployees: function(projectId) {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: '/project/numberOfEmployees',
                        params: {
                            projectId: projectId
                        }
                    }).success(function(data, status, headers, config) {
                        deferred.resolve(data.numberOfEmployees);
                    }).error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }
            };
        }
    ]);
