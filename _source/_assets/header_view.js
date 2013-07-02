window.App.HeaderView = Backbone.View.extend({
  initialize: function () {
    this.$img = this.$('.avatar-image');
    this.setDimensions();

    this.state = new Backbone.Model();
    this.listenTo(this.state, 'change:scale', this.onScaleChange);

    this.$window = $(window);
    var onScroll = _.throttle(this.onScroll.bind(this), 10);
    this.$window.on('scroll', onScroll);
  }

, setDimensions: function () {
    var imageMarginTop = 20;

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

    this.state.set({ scale: scale });
  }

, onScaleChange: function (state, scale) {
    this.$img.css({
      '-webkit-transform': 'scale(' + scale + ')'
    });
  }

});

