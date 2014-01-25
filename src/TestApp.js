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


  var TestAppTemplate = require('text!./templates/TestApp.html');

  var SillyExerciseView = Marionette.ItemView.extend({
    template: Handlebars.compile(
      '<button id="pass" value="pass">PASS</button><button id="fail" value="fail">FAIL</button>'
    ),
    events: {
      'click button': 'onButtonClick'
    },
    onRender: function(){
      console.log('yo', this.el);
      this.trigger('ready');
    },
    onButtonClick: function(e){
      var passFail = $(e.target).attr("id");
      this.model.set('submission', passFail);
      this.model.set('submissionStatus', 'submitting');
      var _m = this.model;
      setTimeout(function(){
        _m.set('submissionStatus', 'completed');
        _m.set('result', passFail);
      }, 500);
    }
  });

  var TestApp = Marionette.Layout.extend({
    template: Handlebars.compile(TestAppTemplate),
    regions: {
      runnerRegion: '.runner_container'
    },

    initialize: function(options){

      var appConfig = options.appConfig;

      /*
       * Setup factories.
       */

      // Model factory.
      this.modelFactory = new ModelFactory();
      this.modelFactory.addHandler('html', Backbone.Model);
      this.modelFactory.addHandler('composite', CompositeModel);
      this.modelFactory.addHandler('sillyExercise', Backbone.Model);

      // View factory.
      this.viewFactory = new ViewFactory();
      this.viewFactory.addHandler('html', HtmlView);
      this.viewFactory.addHandler('composite', CompositeView);
      this.viewFactory.addHandler('sillyExercise', SillyExerciseView);

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

  return TestApp;
});
