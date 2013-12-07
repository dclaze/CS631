var sampleApp = angular.module('sampleApp', ['ngGrid', '$strap.directives', 'ui.bootstrap']);

sampleApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'source/home.html',
                controller: 'HomeController'
            })
            .when('/projectManagement', {
                templateUrl: 'source/projectManagement/views/projectManagement.html',
                controller: 'ProjectManangementController'
            })
            .when('/humanResources', {
                templateUrl: 'source/humanResources/views/humanResources.html',
                controller: 'HumanResourcesController'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
]);

sampleApp.controller('HomeController', function($scope) {
    $scope.message = 'This is the home screen';
});


sampleApp.controller('HumanResourcesController', function($scope) {
    $scope.message = 'This is human resouces screen';
});
