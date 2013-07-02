window.App.SiteContentView = Backbone.View.extend({
  events: {
    'click .hero-focus-blanket': 'onHeroFocusBlanket'
  }

, onHeroFocusBlanket: function () {
    App.trigger('click:heroBlanket', true)
  }

});
