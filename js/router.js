define([
    'jquery',
    'underscore',
    'backbone',
    'backgrid',
    'views/home',
    'views/projectManagement',
    'views/humanResources'
], function($, _, Backbone, Backgrid, HomeView, PMView, HRView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'humanResources': 'showHumanResources',
            'projectManagement': 'showProjects',
            '*actions': 'defaultAction'
        }
    });

    var initialize = function() {
        var app_router = new AppRouter;
        app_router.on('route:showProjects', function() {
            var pmView = new PMView();
            pmView.render();
        });
        app_router.on('route:showHumanResources', function() {
            var hrView = new HRView();
            hrView.render();
        });
        app_router.on('route:defaultAction', function(actions) {
            var homeView = new HomeView();
            homeView.render();
        });
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
