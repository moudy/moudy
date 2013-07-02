(function (View) {
  var cache = {};

  var cacheForView = function (cid) {
    return cache[cid] || (cache[cid] = {});
  };

  View.prototype.ui = function (selector, options) {
    options = (options || {});
    var c = cacheForView(this.cid);

    return c[selector] || (c[selector] = this.$(selector));
  };

})(Backbone.View);
