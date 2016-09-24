var request = require('request')
var homeAssistant = require('./home-assistant')

module.exports = {
  setState: function (entityId, on, brightness) {
    homeAssistant.sendRequest(on ? 'turn_on' : 'turn_off', {entity_id: entityId, brightness: brightness})
  }
}
