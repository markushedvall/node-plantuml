'use strict'

var url = require('url')
var fs = require('fs')

var trace = []
module.exports = function download (uri, filename, changeExitCodeOnError, callback) {
  trace.push('GET ' + uri)
  var protocol = url.parse(uri).protocol.slice(0, -1)

  require(protocol).get(uri, function (res) {
    trace.push('Reponse: ' + res.statusCode)
    if (res.statusCode === 200) {
      // Success, pipe to file
      var fileStream = fs.createWriteStream(filename)
      res.pipe(fileStream)
      if (callback) {
        res.on('end', function () {
          callback()
        })
      }
    } else if (res.headers.location) {
      // Follow redirect
      download(res.headers.location, filename, changeExitCodeOnError, callback)
    } else {
      // Error
      trace.forEach(function (line) {
        console.error(line)
      })
      var error = 'Failed to download ' + filename
      console.error(error)

      if (changeExitCodeOnError) {
        process.exitCode = 1
      }

      if (callback) {
        callback(error)
      }
    }
  })
}
