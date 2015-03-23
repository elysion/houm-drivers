var vera = require("./vera")

function runSceneTemplate(sceneId) {
  return '<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" ' +
  'xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"> <s:Body> ' +
  '<u:RunScene xmlns:u="urn:schemas-micasaverde-org:service:HomeAutomationGateway:1"> ' +
  '<SceneNum>' + sceneId + '</SceneNum> ' +
  '</u:RunScene> ' +
  '</s:Body> ' +
  '</s:Envelope>'
}

var runScene = function(sceneId) {
  vera.hagRequest('urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#RunScene',
    runSceneTemplate(sceneId))
}

module.exports = {
  runScene: runScene
}
