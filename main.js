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

sampleApp.run(function($rootScope, $location, $http) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!$rootScope.loggedIn) {
            $location.path('/home');
            event.preventDefault();

            $http({
                method: 'POST',
                url: '/login/',
            }).success(function(data, status, headers, config) {
                $rootScope.loggedIn = true
            }).error(function(data, status, headers, config) {
                $rootScope.loggedIn = false
            });
        }
    });
})

sampleApp.controller('HomeController', function($scope, $location) {
    $scope.message = 'This is the home screen';
    $scope.onERDiagramButtonClick = function() {
        window.location.href = "/resources/ERDiagram.jpg";
    };
    $scope.onERMappingButtonClick = function() {
        window.location.href = "/resources/CS631_DataBase Design_DC_MK.docx"
    };
    $scope.onGetStartedClick = function() {
        $location.path('/humanResources');
    };
});


sampleApp.controller('HumanResourcesController', function($scope) {
    $scope.message = 'This is human resouces screen. It is designed to allow you to easily create part time and full time employees and get them paid!';
});
