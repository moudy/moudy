---
layout: post
title:  "Sticky UX on the Web"
---

I usually prefer the experince of native applications over web based ones. Web applicatons feel transient, like hotel rooms. Once you leave – they reset. Good software feels like it belings to you.

Native applications generally do a better job of restoring state because the concept is build into the platform. iOS has [encodeRestorableStateWithCoder:](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIViewController_Class/Reference/Reference.html#//apple_ref/occ/instm/UIViewController/encodeRestorableStateWithCoder:) and [NSUserDefaults](https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSUserDefaults_Class/Reference/Reference.html#//apple_ref/occ/instm/NSUserDefaults/registerDefaults%3a). There is a right way to do it, so it's easy for iOS apps to take advangate of the APIs.

There is no "right way" on the web. At a high level a web app's state is represented by it's URL. But what about finer grained sub-states like which tab is active? You could store that information in localStorage or a cookie. But making execptions for ceratin properties and working with the browser's APIs might be enough friction to not bother at all.

Modern browsers (including IE9) support `Object.defineProperty` which you can use to hide the implimentation details of saving state to the user's browser. Let's look at an example.

```js

function clientStateGet (property) {
  return function() {
    return window.localStorage.getItem(property);
  }
}

function clientStateSet (property) {
  return function(value) {
    window.localStorage.setItem(property, value);
  }
}

var userSession = {};

Object.defineProperty(userSession, 'activeTab', {
  get: clientStateGet('activeTab')
, set: clientStateSet('activeTab')
});

userSession.activeTab = 'profileTab'; // saves to localStorage
console.log(userSession.activeTab); // 'profileTab'
```

There's also a nice shorthand for using `Object.defineProperty` if you want to define get/set on the object literal.

```js
var userSession = {
  get activeTab() {
    return clientStateGet('activeTab')();
  }

, set activeTab(value) {
    clientStateSet('activeTab')(value);
  }
}
```

After setting up the getter and setter your application code doesn't need to worry about the implimentation details of how the state is stored. You can simply set the `activeTab` property on the `userSession` object it will persist between reloads. 

## Get & Set with Frameworks
If you are using a library or framework like Backbone or Ember then you can easily apply the equivilant of `Object.defineProperty`.

In Ember you can mark any funtion on an object as a property by calling `.property()` on the funtcion. That function acts as both a getter and setter depending on the number of arguments passed. This makes it really easy to retrieve and store a propery somewhere other than the object.

```js
var UserSession = Ember.Object.extend({

  activeTab: function (key, value) {
    // create a unique key since localStorage
    // is one big key/value store
    var localStorageKey = 'UserSession:'+key;

    // if Setter
    if (arguments.length > 1) {
      window.localStorage.setItem(localStorageKey, value);
    }

    return window.localStorage.getItem(localStorageKey);
  }.property()

});

var userSession = UserSession.create();

userSession.set('activeTab', 'profileTab'); // saves to localStorage
console.log(userSession.get('activeTab')); // 'profileTab'

```

If you're using Backbone you could intercept calls to `get` and `set`.

```js
var UserSession = Backbone.Model.extend({

  set: function (key, value) {
    // call super for original behavoir
    Backbone.Model.prototype.set.apply(this, arguments);
    var localStorageKey = 'UserSession:'+key;
    window.localStorage.setItem(localStorageKey, this.attriubtes[key]);
  }

, get: function () {
    var localStorageKey = 'UserSession:'+key;
    return window.localStorage.getItem(localStorageKey);
  }

});

```

## Real World Example
[Parse](https://parse.com/) has a switch on their dashboard app that lets you toggle the interface between light and dark.

![Parse interface color switch](/images/parse-switch.jpg)

Parse stores the setting in a cookie. If the user changes it to "Dark" and switched computers or browsers it would reset back to "Light". Here's the code:

```js
App.Views.Dashboard.ColorSwitch = Backbone.View.extend({

  events: {"click .color_switch .switch": "switchOption"}

, COOKIE_NAME: "parseDashboardColor"

, initialize: function() {
    if ($.cookie(this.COOKIE_NAME) == "dark") {
      $("body").addClass("dark_dashboard");
      $(".color_switch").children(".switch").children(".switch_cursor").addClass("rightValue");
      $(".color_switch").children(".label").toggleClass("selectedLabel")
    }
  }

, switchColor: function(c) {
    var a = "dark";
    if ($("body").hasClass("dark_dashboard")) {
      $("body").removeClass("dark_dashboard");
      a = "light"
    } else {
      $("body").addClass("dark_dashboard")
    }
    var b = new Date();
    b.setTime(b.getTime() + 3600 * 24 * 3000);
    $.cookie(this.COOKIE_NAME, a, {path: "/",expires: b.toGMTString()})
  }

, switchOption: function(c) {
    var a = "dark";
    if ($(c.target).hasClass("switch_cursor")) {
      $(c.target).toggleClass("rightValue");
      $(c.target).parent().parent().children(".label").toggleClass("selectedLabel")
    } else {
      $(c.target).children(".switch_cursor").toggleClass("rightValue");
      $(c.target).parent().children(".label").toggleClass("selectedLabel")
    }
    if ($("body").hasClass("dark_dashboard")) {
      $("body").removeClass("dark_dashboard");
      a = "light"
    } else {
      $("body").addClass("dark_dashboard")
    }
    var b = new Date();
    b.setTime(b.getTime() + 3600 * 24 * 3000);
    $.cookie(this.COOKIE_NAME, a, {path: "/",expires: b.toGMTString()})
  }
});
```

And here's the cookie:
![Parse inteface color cookie](/images/parse-cookie.jpg)

I was suprised to see all this logic in a `Backbone.View`. It might not be a big issue if the interface color is the only setting that needs to bas saved to the user's browser. But if you are saving several properites you can see how abstracting this logoc into a `UserSettings' model that automaticllly saves it's attributes to the client.

As more native style applications are being built for the browser envoirnment state retoration will become a important. Thinking about how this data is stored early in your applicationt will make it much earier to give the user a consistent experince and expirement with what settings should or should not persist.
