(function () {

  function addClass (el, className) {
    el.className = el.className+' '+className;
  }

  var documentEl = document.documentElement;

  setTimeout(function () {
    addClass(documentEl, 'ready');
  },10);


  var links = document.links;

  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname != window.location.hostname) {
      links[i].target = '_blank';
    }
  }

  if (window.location.pathname !== '/') {
    addClass(documentEl, 'not-home');
  }

})();
