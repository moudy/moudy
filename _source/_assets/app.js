_.extend(App, Backbone.Events);

if (!App.isTouch()) {
  App.headerView = new App.HeaderView({ el: '#site-header' });
  App.siteContentView = new App.SiteContentView({ el: '.site-content' });
}
