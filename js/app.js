define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'backgrid',
], function($, _, Backbone, Router) {
    var initialize = function() {
        Router.initialize();
    };

    return {
        initialize: initialize
    };
});