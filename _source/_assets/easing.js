//window.App.easing = {
  //"ease":        [0.25, 0.1, 0.25, 1.0],
  //"linear":      [0.00, 0.0, 1.00, 1.0],
  //"ease-in":     [0.42, 0.0, 1.00, 1.0],
  //"ease-out":    [0.00, 0.0, 0.58, 1.0],
  //"ease-in-out": [0.42, 0.0, 0.58, 1.0]
//};

(function (App) {
  var easeIn = new KeySpline(0.42, 0.0, 1.00, 1.0)
    , easeOut = new KeySpline(0.00, 0.0, 0.58, 1.0);

  App.round = function (n) { return Math.ceil(n * 100) / 100; }
  App.easeIn = function () { return App.round(easeIn.get.apply(this, arguments)); };
  App.easeOut = function () { return App.round(easeOut.get.apply(this, arguments)); };

})(window.App);
