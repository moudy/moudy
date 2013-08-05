window.App.HeaderView = Backbone.View.extend({
  initialize: function () {
    this.$body = $('body');
    this.$aboutMe = this.$('.about-me');
    this.$footer = this.$('.footer');
    this.$img = this.$('.avatar-image');
    this.setDimensions();

    this.state = new Backbone.Model();
    this.listenTo(this.state, 'change:scale', this.onScaleChange);
    if (App.isPost) this.listenTo(this.state, 'change:heroFocus', this.onHeroFocusChange);

    this.listenTo(App, 'click:heroBlanket', this.scrollToSiteContent);

    this.$window = $(window);

    if (!App.isTouch()) {
      var onScroll = _.throttle(this.onScroll.bind(this), 10);
      this.$window.on('scroll', onScroll);
    }

    if (App.isPost) this.scrollToSiteContent();
    this.initUI();
  }

, initUI: function () {
    this.$body.addClass('init-ui');
  }

, scrollToSiteContent: function (animate) {
    var value = this.imageOffset.top + this.imageHeight - this.imageMarginTop;
    if (animate) {
      $('html, body').animate({ scrollTop: value }, 150);
    } else {
      $('html, body').scrollTop(value);
    }
  }

, events: {
    'click h1, h2': 'onHClick'
  }

, onHClick: function () {
    $('html, body').animate({ scrollTop: 0 }, 150);
  }

, setDimensions: function () {
    this.imageMarginTop = 10;

    this.imageOffset = this.$img.offset();
    this.imageHeight = this.$img.outerHeight();
    this.maxImageHeight = this.imageOffset.top + this.imageHeight;
    this.scrollImageContractBegin = this.imageOffset.top - this.imageMarginTop;
    this.scrollImageContractFinish = this.scrollImageContractBegin + this.imageHeight;

    this.footerHeight = this.$footer.outerHeight();
    this.aboutMeHeight = this.$aboutMe.outerHeight();
  }

, onScroll: function () {
    var scalePercent = 100
      , scrollTop = this.$window.scrollTop();

    // scrollTop maxes out around -177
    if (scrollTop < 0) {
      scalePercent = scalePercent +  -scrollTop;
    } else if (scrollTop > this.scrollImageContractFinish) {
      scalePercent = 0;
    } else if (scrollTop >= this.scrollImageContractBegin) {
      scalePercent = scalePercent - (scrollTop - this.scrollImageContractBegin);
    }

    var scale = scalePercent * 0.01;

    // TODO - figure out better way to stay within range
    if (scale * this.imageHeight > this.maxImageHeight) scale = this.maxImageHeight/this.imageHeight;

    // round up to two decimal places
    scale = Math.ceil(scale * 100) / 100;

    this.state.set({
      scale: scale
    , heroFocus: (scale >= 1)
    });
  }

, onHeroFocusChange: function (state, heroFocus) {
    this.$body.toggleClass('hero-focus', heroFocus);
  }

, onScaleChange: function (state, scale) {
    var scaleInRange = (scale >= 0) && (scale <= 1);

    //console.log('scale', scale, 'easeOut:', App.easeOut(scale), 'easeIn:', App.easeIn(scale));

    this.$img.css({
      '-webkit-transform': 'scale(' + scale + ')'
    , 'opacity': scaleInRange ? App.easeIn(scale) : scale
    });

    this.$aboutMe.css({
      'height': this.aboutMeHeight * (scaleInRange ? App.easeOut(scale) : scale)
     ,'opacity' : scaleInRange ? App.easeIn(scale) : scale
     ,'-webkit-transform': 'scaleY(' + (scaleInRange ? App.easeOut(scale) : scale) + ')'
    });

    this.$footer.css({
      'height': this.footerHeight * (scaleInRange ? App.easeIn(scale) : scale)
    , 'opacity': scaleInRange ? App.easeIn(scale) : scale
    , '-webkit-transform': 'scaleY(' + scale + ')'
    });
  }

});

