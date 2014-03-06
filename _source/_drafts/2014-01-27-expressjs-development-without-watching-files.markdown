---
layout: post
title:  "ExpressJS development without a watching files"
date:   2014-01-27 14:15:47
---

When building apps with ExpressJS I use SASS and Browserify to keep client-side code organized. Until recently I would run a watcher ([grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)) to recomplie SASS and CommonJS into thier browser friendly counterparts. This worked fine but I wanted to remove the cognitive overhead of remebering to run the watcher script. Ideally the assets would compile as they are requested using middleware.

## Browserify Middleware
There's [Browserify middleware module](https://github.com/ForbesLindesay/browserify-middleware) thats really simple to use.
{% highlight javascript %}
if ('development' === app.get('env')) {
  app.use('/app.js', browserify('./path/to/source.js'));
}
{% endhighlight %}


## Node Sass Middleware
compatablity caviat

