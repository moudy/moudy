---
layout: post
title:  "Getting Started with Broccoli"
date:   2014-01-20 14:15:47
---

## What is Brocolli?
When I first looked at [Broccoli](https://github.com/joliss/broccoli) I wasn't clear about what it was and how to use it. It took me a second to understand that it's a web server (a [connect](https://github.com/senchalabs/connect) app) that serves up files on port 4200 by default. If you're confused by how Broccoli works going through the following example will remove most of the mystery.

## The Simplest Example
In a new directory create `Broccoli.js` and `javascripts/app.js`.

``` js
// Brocfile.js
module.exports = function (broccoli) {
  var tree = broccoli.makeTree('javascripts');
  return [tree];
};
```

``` js
// javascripts/app.js
console.log('Hello World');
```

Install broccoli & broccoli-cli then run the server.

``` sh
npm install --save broccoli
npm install --global broccoli-cli

broccoli serve
```

Now you should be able to go to [http://localhost:4200/app.js](http://localhost:4200/app.js) and see the contents of `app.js`. Now run `broccoli build <folder-name>`. This will save the same files served to a folder. You can use this to build the static files when you deploy your application (don't run the broccoli server in production).

## A Useful Example
The real value of Broccoli is filtering files through plugins. Let's say you want to use ES6 features and compile to ES5.

Install the traceur plugin.

``` sh
npm install --save broccoli-traceur
```

Update `Brocfile.js` to filter files through traceur.

``` js
module.exports = function (broccoli) {
  var traceur = require('broccoli-traceur');

  var tree = broccoli.makeTree('javascripts');
  tree = traceur(tree);

  return [tree];
};
```

Add some snazzy ES6 code to `app.js`

``` js
var [foo, bar] = ['foo', 'bar'];
```

Restart the broccoli server and you should see something like the following at [http://localhost:4200/app.js](http://localhost:4200/app.js).

``` js
"use strict";
var __moduleName = (void 0);
var $__0 = ['foo', 'bar'],
    foo = $__0[0],
    bar = $__0[1];
```

## Using Multiple Plugins
Since broccoli plugins return file trees you can chain plugins. If you wanted to also minify your code you can run it through the [UglifyJS Plugin](https://github.com/joliss/broccoli-uglify-js).

``` js
...
var tree = broccoli.makeTree('javascripts');
tree = traceur(tree);
tree = uglifyJavaScript(tree);
...
```

I posted [the code](https://github.com/moudy/getting-started-with-broccoli) on GitHub with setup instructions.

## The Future

Broccoli is young but there are a good amount of [plugins on NPM](https://www.npmjs.org/browse/keyword/broccoli-plugin). It's useful enough that I'm using it to manage assets on new projects. Check out the author's [blog post](http://www.solitr.com/blog/2014/02/broccoli-first-release/) to find out more about the motivation behind the project, how it compares to existing solutions, and next steps.
