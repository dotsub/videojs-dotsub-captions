[![Build Status](https://travis-ci.org/dotsub/videojs-dotsub-captions.svg?branch=master)](https://travis-ci.org/dotsub/videojs-dotsub-captions)
# videojs-dotsub-captions

Renders rich captions

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
