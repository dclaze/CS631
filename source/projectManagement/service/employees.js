angular.module('sampleApp')
    .factory('employeesService', ['$q', '$http',
        function($q, $http) {
            return {
                getEmployees: function() {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: '/employees'
                    }).success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    }).error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }
            };
        }
    ]);
