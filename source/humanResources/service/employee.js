(function(angular) {

    var module = angular.module("sampleApp.employee", []);

    var Employee = function Employee(asyncService) {
        return {
            someApi: function() {
                return asyncService.getStuff();
            }
        };
    }

    module.service('employee', ['asyncService', MyModel]);
}(angular))