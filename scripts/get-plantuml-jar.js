#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var url = require('url')

var PACKAGE_JSON_PATH = path.join(__dirname, '../package.json')
var plantumlVersion = require(PACKAGE_JSON_PATH).plantumlVersion

var JAR_DIR_PATH = path.join(__dirname, '../vendor')
var PLANTUML_JAR = path.join(JAR_DIR_PATH, 'plantuml.jar')

var PLANTUML_FILES_URL = 'https://sourceforge.net/projects/plantuml/files/'
var PLANTUML_FILES_JAR_PATH = plantumlVersion + '/plantuml.' + plantumlVersion + '.jar'

if (!fs.existsSync(JAR_DIR_PATH)) {
  fs.mkdirSync(JAR_DIR_PATH)
}

var trace = []
function download (uri, filename) {
  trace.push('GET ' + uri)
  var protocol = url.parse(uri).protocol.slice(0, -1)

  require(protocol).get(uri, function (res) {
    trace.push('Reponse: ' + res.statusCode)
    if (res.statusCode === 200) {
      // Success, pipe to file
      var fileStream = fs.createWriteStream(filename)
      res.pipe(fileStream)
    } else if (res.headers.location) {
      // Follow redirect
      download(res.headers.location, filename)
    } else {
      // Error
      trace.forEach(function (line) {
        console.error(line)
      })
      console.error('Failed to download plantuml.jar')
      process.exitCode = 1
    }
  })
}

console.log('Downloading plantuml.jar version ' + plantumlVersion)
download(PLANTUML_FILES_URL + PLANTUML_FILES_JAR_PATH, PLANTUML_JAR)
