# THIS REPOSITORY IS OBSOLETE. PLEASE DO NOT SPENT ANY EFFORT ON IT.

[![Build Status](https://travis-ci.org/dotsub/videojs-dotsub-captions.svg?branch=master)](https://travis-ci.org/dotsub/videojs-dotsub-captions) [![npm version](https://badge.fury.io/js/videojs-dotsub-captions.svg)](https://badge.fury.io/js/videojs-dotsub-captions)
# videojs-dotsub-captions

Renders rich captions in the video player. Includes support for 3x3 positioning and basic rich formatting (bold, underline, italic). This plugin uses events to drive all its actions.

### events

*captionsready*: Denotes when the plugin is loaded and ready to receive captions.

*captions*: This event is used to notify the plugin that there are new captions to be rendered. The captions should be sent as the data payload of the event. ex: `player.trigger('captions', []);` would load an empty set of captions.

*language*: Used to set what language the captions are in. This helps properly set the text direction when applicable. The data payload should be an object containing the direction of the text: `{direction: 'rtl' or 'ltr'}`

## Installation

```sh
npm install --save videojs-dotsub-captions
```

## Usage

To include videojs-dotsub-captions on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-dotsub-captions.min.js"></script>
<script>
  var player = videojs('my-video');

  player.dotsubCaptions();
</script>
```

### Browserify

When using with Browserify, install videojs-dotsub-captions via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-dotsub-captions');

var player = videojs('my-video');

player.dotsubCaptions();
```

### Browserify ES6

When using with Browserify, install videojs-dotsub-captions via npm and `import` the plugin as you would any other module.

```js
import videojs from 'video.js';

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
import 'videojs-dotsub-captions';

const player = videojs('my-video');

player.dotsubCaptions();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-dotsub-captions'], function(videojs) {
  var player = videojs('my-video');

  player.dotsubCaptions();
});
```

## License

Apache-2.0. Copyright (c) Brooks Lyrette &lt;brooks@dotsub.com&gt;


[videojs]: http://videojs.com/
