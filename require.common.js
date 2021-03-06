var BOWER_DIR = 'bower_components';

require.config({
  baseUrl: REQUIREJS_BASE_URL,
  paths: {
    text: BOWER_DIR + '/requirejs-text/text',
    jquery: BOWER_DIR + '/jquery/jquery',
    backbone: BOWER_DIR + '/backbone/backbone',
    underscore: BOWER_DIR + '/underscore/underscore',
    marionette: BOWER_DIR + '/marionette/lib/backbone.marionette',
    handlebars: BOWER_DIR + '/handlebars/handlebars',
  },

  packages: [
    {name: 'deck', location: BOWER_DIR + '/musikata.deck/src'},
    {name: 'feelTheBeat', location: BOWER_DIR + '/musikata.feelTheBeat/src'},
    {name: 'audioManager', location: BOWER_DIR + '/musikata.audioManager/src'},
    {name: 'testApp', location: 'src'}
  ],

  shim: {
    'underscore': {
      deps: [],
      exports: '_'
    },

    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'marionette': {
      deps: ['backbone'],
      exports: 'Backbone.Marionette'
    },

    'handlebars': {
      exports: 'Handlebars'
    },

  }
});
