#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var url = require('url')

var PACKAGE_JSON_PATH = path.join(__dirname, '../package.json')
var plantumlVersion = require(PACKAGE_JSON_PATH).plantumlVersion

var JAR_DIR_PATH = path.join(__dirname, '../vendor')
var PLANTUML_JAR = path.join(JAR_DIR_PATH, 'plantuml.jar')
var VIZJS_JAR = path.join(JAR_DIR_PATH, 'vizjs.jar')
var J2V8_WIN_JAR = path.join(JAR_DIR_PATH, 'j2v8_win32_x86_64-3.1.6.jar')
var J2V8_LINUX_JAR = path.join(JAR_DIR_PATH, 'j2v8_linux_x86_64-3.1.6.jar')
var J2V8_MAC_JAR = path.join(JAR_DIR_PATH, 'j2v8_macosx_x86_64-3.1.6.jar')

var PLANTUML_FILES_URL = 'https://sourceforge.net/projects/plantuml/files/'
var PLANTUML_FILES_JAR_PATH = plantumlVersion + '/plantuml.' + plantumlVersion + '.jar'

var VIZJS_URL = 'http://beta.plantuml.net/vizjs.jar'
var J2V8_WIN_URL = 'http://beta.plantuml.net/j2v8_win32_x86_64-3.1.6.jar'
var J2V8_LINUX_URL = 'http://beta.plantuml.net/j2v8_linux_x86_64-3.1.6.jar'
var J2V8_MAC_URL = 'http://beta.plantuml.net/j2v8_macosx_x86_64-3.1.6.jar'

if (!fs.existsSync(JAR_DIR_PATH)) {
  fs.mkdirSync(JAR_DIR_PATH)
}

var trace = []
function download (uri, filename, callback) {
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
      download(res.headers.location, filename, callback)
    } else {
      // Error
      trace.forEach(function (line) {
        console.error(line)
      })
      var error = 'Failed to download ' + filename
      console.error(error)
      process.exitCode = 1
      if (callback) {
        callback(error)
      }
    }
  })
}

console.log('Downloading plantuml.jar version ' + plantumlVersion)
download(PLANTUML_FILES_URL + PLANTUML_FILES_JAR_PATH, PLANTUML_JAR, function (err) {
  if (!err) {
    // once downloaded, check if dot is installed using plantuml's testdot command
    var plantuml = require('../lib/node-plantuml')
    plantuml.testdot(function (isOk) {
      if (!isOk) {
        console.info('graphviz was not found on the system. Downloading vizjs instead. See http://plantuml.com/vizjs. This may take a few minutes.')

        // download additional libraries for working without dot installed.
        download(VIZJS_URL, VIZJS_JAR, function (err) {
          if (!err) {
            // also install the V8 engine just in case the currently installed Java does not have Nashorn
            switch (process.platform) {
              case 'win32':
                download(J2V8_WIN_URL, J2V8_WIN_JAR)
                break
              case 'linux':
                download(J2V8_LINUX_URL, J2V8_LINUX_JAR)
                break
              case 'darwin':
                download(J2V8_MAC_URL, J2V8_MAC_JAR)
                break
              default:
                console.error('Unsupported operating system for V8 jars.')
            }
          }
        })
      }
    })
  }
})
