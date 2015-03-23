var spawn = require('child_process').spawn
var cecClient = spawn('./cec-client')
cecClient.stdout.pipe(process.stdout)

module.exports = {
  sendCommand: function (command) {
    console.log('trying to execute ' + command)
    cecClient.stdin.write(command + '\n')
  }
}