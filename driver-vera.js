var Houmio = require('./js/lib/houm/v2')
var UpnpDevice = require('./js/lib/vera/upnp-device')
var VeraScene = require('./js/lib/vera/scene')
var Bacon = require('baconjs')
var DeviceStatus = require('./js/lib/vera/device-status')
var Vera = require('./js/lib/vera/vera.js')
var ON = DeviceStatus.ON
var OFF = DeviceStatus.OFF

Houmio.init({protocol: 'vera'}, function(events) {
  var veraEvents = events
      .filter(isVera)
      .filter(isWrite)

  var deviceEvents = veraEvents
      .filter(isDeviceEvent)

  var sceneEvents = veraEvents
      .filter(isSceneEvent)

  initDimmerEventHandling(deviceEvents)
  initSwitchEventHandling(deviceEvents)
  initSceneEventHandling(sceneEvents)
})

function isDeviceEvent(event) {
  return isDevice(extractProtocolAddress(event))
}

function isSceneEvent(event) {
  return isScene(extractProtocolAddress(event))
}

function extractProtocolAddress(event) {
  return event.data.protocolAddress
}

function initSwitchEventHandling(deviceEvents) {
  var switchEvents = deviceEvents.filter(isSwitchEvent)

  var switchCommands = Bacon.combineTemplate({
    deviceId: switchEvents.map(protocolAddressToDeviceId),
    switchState: switchEvents.map(extractSwitchState)
  })

  switchCommands.assign(function (data) {
    console.log('sending to vera: ', data)
    UpnpDevice.setDeviceStatus(data.deviceId, data.switchState)
  })
}

function initDimmerEventHandling(deviceEvents) {
  var dimmerEvents = deviceEvents.filter(isDimmerEvent)

  var dimmerCommands = Bacon.combineTemplate({
    deviceId: dimmerEvents.map(protocolAddressToDeviceId),
    dimmerLevel: dimmerEvents.map(extractDimmerLevel)
  })

  dimmerCommands.assign(function (data) {
    console.log('sending to vera: ', data)
    UpnpDevice.setDimmerLevel(data.deviceId, data.dimmerLevel)
  })
}

function initSceneEventHandling(sceneEvents) {
  var sceneIds = sceneEvents.map(protocolAddressToSceneId)

  sceneIds.assign(function (sceneId) {
    console.log('activating vera scene: ', sceneId)
    VeraScene.runScene(sceneId)
  })
}

function isVera(event) {
  return event.protocol == 'vera'
}

function isWrite(message) {
  return message.command == 'write'
}

function isDevice(protocolAddress) {
  return protocolAddress.indexOf('device') == 0
}

function isScene(protocolAddress) {
  return protocolAddress.indexOf('scene') == 0
}


function protocolAddressToDeviceId(event) {
  return event.data.protocolAddress.split(':')[1].trim()
}

function protocolAddressToSceneId(event) {
  return event.data.protocolAddress.split(':')[1].trim()
}

function extractDimmerLevel(event) {
  return Math.round(event.data.bri / Houmio.MAX_BRIGHTNESS_VALUE * Vera.MAX_DIMMER_VALUE)
}

function extractSwitchState(event) {
  return event.data.on ? ON : OFF
}

function isDimmerEvent(event) {
  return event.data.type == 'dimmable'
}

function isSwitchEvent(event) {
  return event.data.type == 'binary'
}