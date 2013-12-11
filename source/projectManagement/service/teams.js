angular.module('sampleApp')
    .factory('teamsService', ['$q', '$http',
        function($q, $http) {
            return {
                getTeamsGridView: function() {
                    var deferred = $q.defer();
                    $http({
                        method: 'GET',
                        url: '/teams'
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
