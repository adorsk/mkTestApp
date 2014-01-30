require(
  [
  'testApp/FeelTheBeatApp'
], 
function(
  FeelTheBeatApp
){
  var app = new FeelTheBeatApp({
    el: '#app-container',
    appConfig: appConfig
  });

  app.render();
});
