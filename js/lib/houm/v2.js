var Bacon = require('baconjs')
var Socket = require('net').Socket
var carrier = require('carrier')

function toLines(socket) {
  return Bacon.fromBinder(function(sink) {
    carrier.carry(socket, sink)
    socket.on("close", function() {
      return sink(new Bacon.End())
    })
    socket.on("error", function(err) {
      return sink(new Bacon.Error(err))
    })
    return function() {}
  })
}

function init(options, cb) {
  var houmioBridge = options.bridge || process.env.HOUMIO_BRIDGE || "localhost:3001"
  var socket = new Socket()

  socket.connect(houmioBridge.split(":")[1], houmioBridge.split(":")[0], function() {
    var lineStream = toLines(socket)
    socket.write((JSON.stringify({
      command: "driverReady",
      protocol: options.protocol
    })) + "\n");

    cb(lineStream.map(JSON.parse))
  })
}

module.exports = {
  init: init,
  MAX_BRIGHTNESS_VALUE: 255
}