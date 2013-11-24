angular.module('sampleApp')
    .controller('ProjectManangementController', ['$scope','$modal',
        function($scope, $modal) {
            $scope.message = 'This is project management screen';

            $scope.onCreateProjectClick = function($event, data) {
                $event.preventDefault();
                var m = $modal({
                    templateUrl: 'createProject.html',
                    backdrop: true,
                    windowClass: 'modal',
                    controller: function($scope, $modalInstance, $log, user) {
                        $scope.user = user;
                        $scope.submit = function() {
                            $log.log('Submiting user info.');
                            $log.log(user);
                            $modalInstance.dismiss('cancel');
                        }
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        user: function() {
                            return $scope.user;
                        }
                    }
                });
            }
        }
    ]);
