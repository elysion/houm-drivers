var Houmio = require('./js/lib/houm/v2')
var Cec = require('./js/lib/cec/cec')

Houmio.init({protocol: 'cec'}, function(events) {
  var cecEvents = events
      .filter(isCec)
      .filter(isWrite)

  initPowerEventHandling(cecEvents)
  initRawEventHandling(cecEvents)
})

function initPowerEventHandling(cecEvents) {
  var powerCommands = cecEvents
      .filter(isPowerEvent)
      .map(powerEventToCecCommand)

  powerCommands.assign(Cec.sendCommand)
}

function initRawEventHandling(cecEvents) {
  var txCommands = cecEvents
      .filter(isRawEvent)
      .map('.data.protocolAddress')

  txCommands.assign(Cec.sendCommand)
}
function powerEventToCecCommand(event) {
  return (event.data.on ? 'on ' : 'standby ') + protocolAddressToCecAddress(event.data.protocolAddress)
}

function protocolAddressToCecAddress(protocolAddress) {
  var parts = protocolAddress.split(' ')
  return parts[1] == 'all' ? 'f' : parts[1]
}

function isPowerEvent(event) {
  return protocolAddressContains(event, 'power')
}

function isRawEvent(event) {
  return protocolAddressContains(event, 'tx')
}

function protocolAddressContains(event, needle) {
  return event.data.protocolAddress.indexOf(needle) != -1
}

function isCec(message) {
  return message.protocol == 'cec'
}

function isWrite(message) {
  return message.command == 'write'
}