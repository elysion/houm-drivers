var Houmio = require('./js/lib/houm/v2')
var Xbmc = require('./js/lib/xbmc/xbmc')

Xbmc.init({}, function(streams) {
  console.log('xbmc initiated')
  streams.connection.log('connection')
  streams.events.log('events')

  Houmio.init({protocol: 'xbmc'}, function(events) {
    var writeEvents = events
        .filter(isXbmc)
        .filter(isWrite)

    var playCommands = writeEvents
        .filter(isPlayerEvent)
        .map('.data.protocolAddress')
        .map(protocolAddressToXbmcPlayerCommand)

    var applicationCommands = writeEvents
        .filter(not(isSetVolumeEvent))
        .filter(isApplicationEvent)
        .map('.data.protocolAddress')
        .map(protocolAddressToXbmcApplicationCommand)

    var setVolumeCommands = writeEvents
        .filter(isSetVolumeEvent)
        .map('.data.bri')
        .map(dimmerLevelToXbmcSetVolumeCommand)

    streams.commands.plug(playCommands)
    streams.commands.plug(applicationCommands)
    streams.commands.plug(setVolumeCommands)
  })
})

function protocolAddressToXbmcPlayerCommand(protocolAddress) {
  var parts = protocolAddress.split(':')
  var playerId = 1
  return {method: parts[0], data: [playerId, parts[1]]}
}

function protocolAddressToXbmcApplicationCommand(protocolAddress) {
  var parts = protocolAddress.split(':')
  return {method: parts[0], data: [parts[1]]}
}

function dimmerLevelToXbmcSetVolumeCommand(dimmerLevel) {
  return {method: 'Application.SetVolume', data: [Math.round(dimmerLevel*100/255)]}
}

function isPlayerEvent(event) {
  return protocolAddressContains(event, 'Player')
}

function isApplicationEvent(event) {
  return protocolAddressContains(event, 'Application')
}

function isSetVolumeEvent(event) {
  return event.data.protocolAddress == 'Application.SetVolume'
}

function protocolAddressContains(event, needle) {
  return event.data.protocolAddress.indexOf(needle) != -1
}

function isXbmc(message) {
  return message.protocol == 'xbmc'
}

function isWrite(message) {
  return message.command == 'write'
}

function not(fun) {
  return function () {
    return !fun.apply(this, Array.prototype.slice.apply(arguments))
  }
}