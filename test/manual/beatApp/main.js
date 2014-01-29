require(
  [
  'testApp/FeelTheBeatApp'
], 
function(
  FeelTheBeatApp
){
  var app = new FeelTheBeatApp({
    el: '#app_container',
    appConfig: appConfig
  });

  app.render();
});
