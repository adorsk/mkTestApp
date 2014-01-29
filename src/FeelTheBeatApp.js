define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var ModelFactory = require('deck/ModelFactory');
  var ViewFactory = require('deck/ViewFactory');
  var HtmlView = require('deck/HtmlView');
  var CompositeModel = require('deck/CompositeModel');
  var CompositeView = require('deck/CompositeView');
  var DeckModel = require('deck/DeckModel');
  var MusikataExerciseRunnerModel = require('deck/MusikataExerciseRunnerModel');
  var MusikataExerciseRunnerView = require('deck/MusikataExerciseRunnerView');

  var FeelTheBeatExerciseView = require('feelTheBeat/FeelTheBeatExerciseView');

  var TestAppTemplate = require('text!./templates/TestApp.html');

  var FeelTheBeatApp = Marionette.Layout.extend({
    template: Handlebars.compile(TestAppTemplate),
    regions: {
      runnerRegion: '.runner_container'
    },

    initialize: function(options){

      var appConfig = options.appConfig;

      /*
       * Setup audioContext and sound manager.
       */
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var audioContext = new AudioContext();
      this.audioContext = audioContext;
      var SoundManager = function(){
        this.context = audioContext;
      };
      _.extend(SoundManager.prototype, {
        getBufferPromise: function(key){
          // Fake loading by creating noise buffer.
          var buffer = this.context.createBuffer(1, 44100, 44100);
          var data = buffer.getChannelData(0);
          for (i = 0; i < data.length; i++) {
            data[i] = 0;
          }
          var deferred = new $.Deferred();
          deferred.resolve(buffer);
          return deferred.promise();
        }
      });
      this.soundManager = new SoundManager();

      /*
       * Setup factories.
       */

      // Model factory.
      this.modelFactory = new ModelFactory();
      this.modelFactory.addHandler('html', Backbone.Model);
      this.modelFactory.addHandler('composite', CompositeModel);
      this.modelFactory.addHandler('feelTheBeat', Backbone.Model);

      // View factory.
      this.viewFactory = new ViewFactory();
      this.viewFactory.addHandler('html', function(options){
        return new HtmlView(options);
      });
      this.viewFactory.addHandler('composite', _.bind(function(options){
        return new CompositeView(
          _.extend({viewFactory: this.viewFactory}, options));
      }, this));
      this.viewFactory.addHandler('feelTheBeat', _.bind(function(options){
        var mergedOptions = _.extend({
          audioContext: this.audioContext,
          soundManager: this.soundManager,
          requestAnimationFrame: function(callback){
           return  window.requestAnimationFrame(callback);
          }
        }, options);
        return new FeelTheBeatExerciseView(mergedOptions);
      }, this));

      /* 
       * Setup models.
       */
      var deckModelOptions = {
        parse: true,
        modelFactory: this.modelFactory
      };
      var introDeckModel = new DeckModel(
        { slides: appConfig.introSlides }, 
        deckModelOptions
      );

      var exerciseDeckModel = new DeckModel(
        { slides: appConfig.exerciseSlides },
        deckModelOptions
      );

      this.runnerModel = new MusikataExerciseRunnerModel({
        introDeck: introDeckModel,
        exerciseDeck: exerciseDeckModel,
        destination: options.destination
      });
    },

    onRender: function(){
      // Create and show exercise runner.
      this.runnerView = new MusikataExerciseRunnerView({
        model: this.runnerModel,
        viewFactory: this.viewFactory
      });

      this.runnerRegion.show(this.runnerView);
    }
  });

  return FeelTheBeatApp;
});
