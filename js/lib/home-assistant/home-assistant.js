var request = require('request')

function getHomeAssistantUrl() {
  return 'http://' + process.env.HOME_ASSISTANT_URL
}

module.exports = {
  sendRequest: function (service, data) {
    var uri = getHomeAssistantUrl() + '/api/services/homeassistant/' + service
    var options = {
      headers: {
        'content-type': 'application/json',
        'X-HA-access': process.env.HOME_ASSISTANT_API_PASSWORD
      },
      uri: uri,
      method: 'POST',
      json: data
    }
    request.post(options)
  },
  MAX_DIMMER_VALUE: 255
}
