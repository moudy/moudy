(function () {
  setTimeout(function () {
  var de = document.documentElement;
  de.className = de.className+' ready';
  },10);


  var links = document.links;

  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname != window.location.hostname) {
      links[i].target = '_blank';
    }
  }

})();
