window.App.HeaderView = Backbone.View.extend({
  initialize: function () {
    this.$aboutMe = this.$('.about-me');
    this.$footer = this.$('.footer');
    this.$img = this.$('.avatar-image');
    this.setDimensions();

    this.state = new Backbone.Model();
    this.listenTo(this.state, 'change:scale', this.onScaleChange);
    if (App.isPost) this.listenTo(this.state, 'change:heroFocus', this.onHeroFocusChange);

    this.$window = $(window);
    var onScroll = _.throttle(this.onScroll.bind(this), 10);
    this.$window.on('scroll', onScroll);
  }

, events: {
    'click h1, h2': 'onHClick'
  }

, onHClick: function () {
    $('html, body').animate({ scrollTop: 0 }, 80);
  }

, setDimensions: function () {
    var imageMarginTop = 10;

    this.imageOffset = this.$img.offset();
    this.imageHeight = this.$img.outerHeight();
    this.maxImageHeight = this.imageOffset.top + this.imageHeight;
    this.scrollImageContractBegin = this.imageOffset.top - imageMarginTop;
    this.scrollImageContractFinish = this.scrollImageContractBegin + this.imageHeight;
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
    $('body').toggleClass('hero-focus', heroFocus);
  }

, onScaleChange: function (state, scale) {
    var aboutMeCss = {}
      , footerCss = {}
      , ABOUT_ME_HEIGHT = 140
      , FOOTER_HEIGHT = 40;

    aboutMeCss.height = ABOUT_ME_HEIGHT * scale;
    aboutMeCss.opacity = scale;
    aboutMeCss['-webkit-transform'] = 'scaleY(' + scale + ')';
    //aboutMeCss['-webkit-transform'] = 'scaleX(' + scale + ')';

    footerCss.height = FOOTER_HEIGHT * scale;
    footerCss.opacity = scale;
    footerCss['-webkit-transform'] = 'scaleY(' + scale + ')';

    console.log(footerCss, this.$footer)

    this.$footer.css(footerCss);
    this.$aboutMe.css(aboutMeCss);
    console.log('scale', scale)

    this.$img.css({
      '-webkit-transform': 'scale(' + scale + ')'
    });
  }

});

