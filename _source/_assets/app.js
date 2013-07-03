_.extend(App, Backbone.Events);


App.headerView = new App.HeaderView({ el: '#site-header' });
App.siteContentView = new App.SiteContentView({ el: '.site-content' });
