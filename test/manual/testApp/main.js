require(
  [
  'testApp/TestApp'
], 
function(
  TestApp
){
  var app = new TestApp({
    el: '#app_container',
    appConfig: appConfig
  });

  app.render();
});
