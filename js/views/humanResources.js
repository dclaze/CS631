define(['jquery', 'underscore', 'backbone', 'text!/../templates/humanResources.html'],
    function($, _, Backbone, hrTemplate) {
        var HomeView = Backbone.View.extend({
            el: $("#page"),

            render: function() {
                $('.menu li').removeClass('active');
                $('.menu li a[href="#humanResources"]').parent().addClass('active');
                this.$el.html(hrTemplate);
            }
        });

        return HomeView;

    });