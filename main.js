var sampleApp = angular.module('sampleApp', ['ngGrid', '$strap.directives']);

sampleApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .when('/projectManagement', {
                templateUrl: 'views/projectManagement/projectManagement.html',
                controller: 'ProjectManangementController'
            })
            .when('/humanResources', {
                templateUrl: 'views/humanResources/humanResources.html',
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
