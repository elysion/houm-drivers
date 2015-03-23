var Bacon = require('baconjs')
var WebSocket = require('ws')

module.exports = {
    init: init
}

WebSocket.prototype.sendJSON = function(obj) {
    this.send(JSON.stringify(obj))
}

var sitekey = process.env.HOUMIO_SITE_KEY;
var socket = new WebSocket('wss://houmi.herokuapp.com')

function subscribe(vendor) {
    send('subscribe', vendor)
}

function publish(vendor) {
    send('publish', vendor)
}

function send(command, vendor) {
    return socket.sendJSON({command: command, data: {sitekey: sitekey, vendor: vendor}})
}

function init(options) {
    socket.on("open", function () {
        console.log('Connected to Houm.io')

        if (options.subscribe) {
            console.log('Subscribing ' + options.subscribe)
            subscribe(options.subscribe)
        }

        if (options.publish) {
            console.log('Publishing ' + options.publish)
            publish(options.publish)
        }
    })

    socket.on("close", function() { console.log("Websocket closed") })
    socket.on("error", function() { console.log("Websocket error") })
    socket.on("ping", socket.pong)

//    setInterval(function() {socket.ping(null, {}, false)}, 3000)

    return Bacon.fromEventTarget(socket, 'message').map('.data').map(JSON.parse)
}
