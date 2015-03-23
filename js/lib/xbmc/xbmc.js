var Bacon = require('baconjs')
var Xbmc = require('xbmc-ws');

var commands = new Bacon.Bus()

module.exports = {
  init: init
}

var EVENTS = {
  Application: [
    'OnVolumeChanged'
  ],
  Player: [
    'OnPause',
    'OnPlay',
    'OnStop'
  ]
}

function init(options, cb) {
  var envHostParts = (process.env.XBMC_HOST || '').split(':')
  var connection = Xbmc(options.host || envHostParts[0] || '127.0.0.1', options.port || envHostParts[1] || 9090);

  cb({connection: connectionStream(connection), events: toStream(connection, EVENTS), commands: commands})

  connection.on('connection', function () {
    console.info("XBMC connection opened");
  })

  commands.assign(function(command) {
    var data = command.data == 'true' || command.data == 'false' ? command.data == 'true' : command.data

    console.log('running ', command.method, 'with data', data)
    connection.run(command.method).apply(null, data.filter(function (data) { return data !== undefined }))
  })
}

function connectionStream(connection) {
  return Bacon.fromBinder(function(sink) {
    connection.on('close', function() {
      return sink(new Bacon.End())
    })
    connection.on('error', function(error) {
      return sink(new Bacon.Error(error))
    })
    return function() {}
  })
}


function toStream(connection, events) {
  return Bacon.fromBinder(function(sink) {
    for (var type in EVENTS) {
      EVENTS[type].forEach(function(event) {
        var method = type + '.' + event
        connection.on(method, function(data) {
          return sink({method: method, data: data})
        })
      })
    }
    return function() {}
  })
}
