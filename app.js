AppRouter = Backbone.Router.extend({
    routes: {
        '/humanResources': 'showHumanResources'
    }
});

var initialize = function() {
    var app_router = new AppRouter;
    app_router.on('showHumanResources', function() {
        debugger
        // var projectListView = new ProjectListView();
        // projectListView.render();
    });
    app_router.on('defaultAction', function(actions) {
        console.log('No route:', actions);
    });
    Backbone.history.start();
};
return {
    initialize: initialize
};