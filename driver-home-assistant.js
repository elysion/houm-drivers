var Houmio = require('./js/lib/houm/v2')
var Bacon = require('baconjs')
var Entity = require('./js/lib/home-assistant/entity.js')
var HomeAssistant = require('./js/lib/home-assistant/home-assistant.js')

Houmio.init({protocol: 'home-assistant'}, function(events) {
  var homeAssistantEvents = events
    .filter(isHomeAssistant)
    .filter(isWrite)

  initDimmerEventHandling(homeAssistantEvents)
  initSwitchEventHandling(homeAssistantEvents)
})

function extractProtocolAddress(event) {
  return event.data.protocolAddress
}

function initSwitchEventHandling(deviceEvents) {
  var switchEvents = deviceEvents.filter(isSwitchEvent)

  var switchCommands = Bacon.combineTemplate({
    entityId: switchEvents.map(protocolAddressToEntityId),
    switchState: switchEvents.map(extractSwitchState)
  })

  switchCommands.assign(function (data) {
    console.log('sending to home-assistant: ', data)
    Entity.setState(data.entityId, data.switchState)
  })
}

function initDimmerEventHandling(deviceEvents) {
  var dimmerEvents = deviceEvents.filter(isDimmerEvent)

  var dimmerCommands = Bacon.combineTemplate({
    entityId: dimmerEvents.map(protocolAddressToEntityId),
    brightness: dimmerEvents.map(extractDimmerLevel)
  })

  dimmerCommands.assign(function (data) {
    console.log('sending to home-assistant: ', data)
    Entity.setState(data.entityId, true, data.brightness)
  })
}

function isHomeAssistant(event) {
  return event.protocol == 'home-assistant'
}

function isWrite(message) {
  return message.command == 'write'
}

function protocolAddressToEntityId(event) {
  return event.data.protocolAddress
}

function extractDimmerLevel(event) {
  return Math.round(event.data.bri / Houmio.MAX_BRIGHTNESS_VALUE * HomeAssistant.MAX_DIMMER_VALUE)
}

function extractSwitchState(event) {
  return event.data.on
}

function isDimmerEvent(event) {
  return event.data.type == 'dimmable'
}

function isSwitchEvent(event) {
  return event.data.type == 'binary'
}
