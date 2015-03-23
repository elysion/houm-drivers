var Houmio = require('./js/lib/houm/v2')
var Xbmc = require('./js/lib/xbmc/xbmc')

Xbmc.init({}, function(streams) {
  console.log('xbmc initiated')
  streams.connection.log('connection')
  streams.events.log('events')

  Houmio.init({protocol: 'xbmc'}, function(events) {
    var playCommands = events
        .filter(isXbmc)
        .filter(isWrite)
        .filter(isPlayerEvent)
        .map('.data.protocolAddress')
        .map(protocolAddressToXbmcPlayerCommand)

    streams.commands.plug(playCommands)
  })
})

function protocolAddressToXbmcPlayerCommand(protocolAddress) {
  var parts = protocolAddress.split(':')
  var playerId = 1
  return {method: parts[0], data: [playerId, parts[1]]}
}

function isPlayerEvent(event) {
  return protocolAddressContains(event, 'Player')
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