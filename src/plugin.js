import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  language: { direction: 'ltr' },
  captions: []
};

let settings = {};

/**
 * Supported formatting styles 'NAME': ['startTag', 'endTag']
 */
const styleToTag = {
  BOLD: ['<b>', '</b>'],
  ITALIC: ['<i>', '</i>'],
  UNDERLINE: ['<u>', '</u>']
};

/**
 * Function is used to convert a caption object to renderable HTML.
 *
 * @function convertToHtml
 * @param    {Array} [caption={Caption}]
 */
const convertToHtml = (caption) => {
  let displayValue = '';
  const str = caption.content;

  if (caption.inlineStyles) {
    for (let i = 0; i <= str.length; i++) {
      for (const style of caption.inlineStyles) {
        if (i === style.offset) {
          displayValue += styleToTag[style.style][0];
        } else if (i === style.offset + style.length) {
          displayValue += styleToTag[style.style][1];
        }
      }
      if (i < str.length) {
        displayValue += str[i];
      }
    }
  } else {
    displayValue = caption.content;
  }
  return displayValue.replace(/\n/g, '<br/>');
};

/**
 * Renders the captions that should be on screen.
 *
 * @function updateCaption
 * @param    {Player} player
 */
const updateCaption = (player) => {
  const time = player.currentTime() * 1000;

  const videoEl = player.el();
  const captions = settings.captions.filter((caption) => {
    return caption.start <= time && caption.end >= time;
  });

  const textElement = videoEl.getElementsByClassName('vjs-text')[0];
  const textContainer = videoEl.getElementsByClassName('vjs-caption-containter')[0];

  // TODO: There can now be two captions with the same timecode.
  if (textElement && captions[0]) {

    // set the horizontal position
    if (captions[0].horizontalPosition) {
      textContainer.style['text-align'] = captions[0].horizontalPosition.toLowerCase();
    } else {
      textContainer.style['text-align'] = 'center';
    }

    //set the vertical position
    if (captions[0].verticalPosition) {
      const vp = captions[0].verticalPosition;
      if (vp === 'BOTTOM') {
        textContainer.style.bottom = '40px';
        textContainer.style.top = '';
      } else if (vp === 'MIDDLE') {
        textContainer.style.bottom = '';
        textContainer.style.top = `${player.height()/3 + 10}px`;
      } else if (vp === 'TOP') {
        textContainer.style.bottom = '';
        textContainer.style.top = '10px';
      }
    } else {
      textContainer.bottom = '40px';
      textContainer.style.top = '';
    }

    textElement.innerHTML = convertToHtml(captions[0]);
    textContainer.classList.remove('vjs-hidden');
  } else {
    textElement.innerHTML = '';
    textContainer.classList.add('vjs-hidden');
  }
};

/**
 * Function is used to set the captions for the plugin. Captions must be an array.
 *
 * Captions from v2 of Dotsub are in the form:
 *          {start: timeInMills, duration: timeInMills, content: 'Caption Text'}
 * Captions from v3 of Dotsub are in the form:
 *          {start: timeInMills, end: timeInMills, content: 'Caption Text'}
 * v3 can also contain formatting and position data {position, inlineStyles: []}
 *
 * @function setCaptions
 * @param    {Player} player
 * @param    {Array} [captions=[{Caption}]]
 */
const setCaptions = (player, captions) => {
  settings.captions = captions;
  updateCaption(player);
};

/**
 * Function is used to set the language of the video player.
 *
 * Expects { direction: 'rtl' or 'ltr' }
 *
 * @function setLanguage
 * @param    {Player} player
 * @param    {Object} [language={}]
 */
const setLanguage = (player, language) => {
  settings.language = language;

  // update the text direction on all caption spans
  const videoEl = player.el();
  const textElements = videoEl.getElementsByClassName('vjs-text');

  textElements.forEach(element => element.direction = language.direction);
};

/**
 * Sets up HTML in the player for caption rendering.
 *
 * Expects { direction: 'rtl' or 'ltr' }
 *
 * @function setupCaptions
 * @param    {Player} player
 */
const setupCaptions = (player) => {
  // set up divs for rendering
  const videoEl = player.el();
  const container = document.createElement('div');
  const wrapper = document.createElement('div');
  const span = document.createElement('div');

  container.appendChild(wrapper);
  wrapper.appendChild(span);
  container.classList.add('vjs-caption-containter');
  container.classList.add('vjs-hidden');
  wrapper.classList.add('vjs-caption');
  span.classList.add('vjs-text');

  videoEl.appendChild(container);
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-dotsub-captions');

  setupCaptions(player);

  // export functions to be called externally
  player.setCaptions = (captions) => setCaptions(player, captions);
  player.setLanguage = (langauge) => setLanguage(player, langauge);
  // setup event listeners a well.
  player.on('captions', (event, data) => setCaptions(player, data));
  player.on('language', (event, data) => setCaptions(player, data));
  player.on('timeupdate', () => updateCaption(player));
  // emit that the player is ready to receive captions
  player.trigger('captionsready');
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function dotsubCaptions
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const dotsubCaptions = function(options) {
  this.ready(() => {
    settings = videojs.mergeOptions(defaults, options);
    onPlayerReady(this, settings);
  });
};

// Register the plugin with video.js.
videojs.plugin('dotsubCaptions', dotsubCaptions);

// Include the version number.
dotsubCaptions.VERSION = '__VERSION__';

export default dotsubCaptions;
