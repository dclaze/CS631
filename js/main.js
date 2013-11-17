require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',//'libs/backbone/backbone-min',
        backgrid: 'https://gist.github.com/wyuenho/07656b02b11f7c83ca0d/raw/596c0f3c16137fda5f976cd2565894cbb3562c32/backgrid'
    },
    shim: {
    	backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        backgrid: {
            deps: ['jquery', 'underscore', 'backbone', 'css!libs/backgrid/backgrid.css' ],
            exports: 'Backgrid'
        }
    }
});

require([
    'app'
], function(App) {
    App.initialize();
});
