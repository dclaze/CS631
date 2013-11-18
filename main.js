var sampleApp = angular.module('sampleApp', ['ngGrid']);

sampleApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            })
            .when('/projectManagement', {
                templateUrl: 'templates/projectManagement.html',
                controller: 'ProjectManagement'
            })
            .when('/humanResources', {
                templateUrl: 'templates/humanResouces.html',
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

sampleApp.controller('ProjectManagement', function($scope) {
    $scope.message = 'This is project management screen';

});

sampleApp.controller('HumanResourcesController', function($scope) {
    $scope.message = 'This is human resouces screen';
});
