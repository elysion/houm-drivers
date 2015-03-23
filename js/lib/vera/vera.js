var request = require('request')
var fs = require('fs')
var qs = require('querystring')

function getVeraUrl() {
    return 'http://' + process.env.VERA_IP
}

function getDataRequestUrl() {
    return getVeraUrl() + '/port_3480/data_request'
}

function getHagRequestUrl() {
    return getVeraUrl() + '/port_49451/upnp/control/hag'
}

function dataRequest(action, parameters) {
    return request.get(getDataRequestUrl() + '?id=' + action + '&' + qs.stringify(parameters || []),
        function(error, response, body) {
            if (error) {
                console.log(error)
            }
        })
}

function hagRequest(action, data) {
    var veraUrl = getHagRequestUrl()
    var headers = {
        'content-type': 'text/xml',
        'SOAPACTION': '"' + action + '"'
    }

    return request.post({url: veraUrl, body: data, headers: headers}, function(error, response, body) {
        if (error) {
            console.log(error)
        }
    })
}

module.exports = {
    'dataRequest': dataRequest,
    'hagRequest': hagRequest,
    MAX_DIMMER_VALUE: 100
}
