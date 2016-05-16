import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-dotsub-captions', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    Player.prototype.dotsubCaptions,
    plugin,
    'videojs-dotsub-captions plugin was registered'
  );

  this.player.dotsubCaptions();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.hasClass('vjs-dotsub-captions'),
    'the plugin adds a class to the player'
  );
});

QUnit.test('plugin throws captionsready event', function(assert) {
  assert.expect(1);

  const stub = sinon.stub(this.player, 'trigger');

  this.player.dotsubCaptions();

  // Tick the clock forward enough to trigger the player to be "captionsready".
  this.clock.tick(5);

  assert.ok(
    stub.calledWith('captionsready'),
    'the plugin adds a class to the player'
  );

  stub.restore();
});

QUnit.test('adds a caption container', function(assert) {
  assert.expect(1);

  this.player.dotsubCaptions({
    captions: [{start: 0, end: 3000, content: 'foo'}]
  });

  this.clock.tick(5);

  const captionContainers = this.player.contentEl()
          .getElementsByClassName('vjs-caption-containter');

  assert.equal(
    1,
    captionContainers.length,
    'The plugin should add a caption continer'
  );
});

QUnit.test('renders multiple captions in the same container', function(assert) {
  assert.expect(2);

  this.player.dotsubCaptions({
    captions: [
      {start: 0, end: 3000, content: 'foo'},
      {start: 0, end: 3000, content: 'bar!'}
    ]
  });

  this.clock.tick(5);

  const captionContainers = this.player.contentEl()
          .getElementsByClassName('vjs-caption-containter');

  assert.equal(
    1,
    captionContainers.length,
    'The plugin should add a caption continer'
  );

  const captionHolder = this.player.contentEl()
          .getElementsByClassName('vjs-caption');

  assert.equal(
    2,
    captionHolder.length,
    'The plugin should add two captions'
  );
});

QUnit.test('renders multiple captions in different containers', function(assert) {
  assert.expect(2);

  this.player.dotsubCaptions({
    captions: [
      {start: 0, end: 3000, content: 'foo'},
      {start: 0, end: 3000, content: 'bar!', verticalPosition: 'TOP'}
    ]
  });

  this.clock.tick(5);

  const captionContainers = this.player.contentEl()
          .getElementsByClassName('vjs-caption-containter');

  assert.equal(
    2,
    captionContainers.length,
    'The plugin should add two caption continers'
  );

  const captionHolder = this.player.contentEl()
          .getElementsByClassName('vjs-caption');

  assert.equal(
    2,
    captionHolder.length,
    'The plugin should add two captions'
  );
});

QUnit.test('renders inlineStyles', function(assert) {
  assert.expect(3);

  this.player.dotsubCaptions({
    captions: [{start: 0, end: 3000, content: 'test line of text', inlineStyles: [
      {style: 'BOLD', offset: 0, length: 4},
      {style: 'BOLD', offset: 13, length: 4},
      {style: 'ITALIC', offset: 8, length: 2}
    ]}]
  });

  this.clock.tick(5);

  const captionContainer = this.player.contentEl()
          .getElementsByClassName('vjs-caption')[0];

  assert.equal(
    2,
    captionContainer.getElementsByTagName('b').length,
    'The plugin should add a caption continer'
  );
  assert.equal(
    1,
    captionContainer.getElementsByTagName('i').length,
    'The plugin should add a caption continer'
  );
  assert.equal(
    0,
    captionContainer.getElementsByTagName('u').length,
    'The plugin should add a caption continer'
  );
});
