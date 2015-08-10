'use strict'

var childProcess = require('child_process')
var path = require('path')
var nailgun = require('node-nailgun-server')
var ngClient = require('node-nailgun-client')
var util = require('util')

var PLANTUML_JAR = path.join(__dirname, '../vendor/plantuml.jar')
var PLANTUML_MAIN = 'net.sourceforge.plantuml.Run'

var LOCALHOST = 'localhost'
var GENERATE_PORT = 0

var nailgunServer
var clientOptions
var nailgunRunning = false

module.exports.useNailgun = function (callback) {
  var options = { address: LOCALHOST, port: GENERATE_PORT }
  nailgunServer = nailgun.createServer(options, function (port) {
    clientOptions = {
      host: LOCALHOST,
      port: port
    }

    ngClient.exec('ng-cp', [PLANTUML_JAR], clientOptions)

    // Give Nailgun some time to load the classpath
    setTimeout(function () {
      nailgunRunning = true
      if (util.isFunction(callback)) {
        callback()
      }
    }, 50)
  })

  return nailgunServer
}

// TODO: proper error handling
function execWithNailgun (argv, cb) {
  return ngClient.exec(PLANTUML_MAIN, argv, clientOptions)
}

// TODO: proper error handling
function execWithSpawn (argv, cb) {
  var opts = ['-Djava.awt.headless=true', '-jar', PLANTUML_JAR].concat(argv)
  return childProcess.spawn('java', opts)
}

module.exports.exec = function (argv, callback) {
  if (util.isFunction(argv)) {
    callback = argv
    argv = undefined
  }

  var task
  if (nailgunRunning) {
    task = execWithNailgun(argv, callback)
  } else {
    task = execWithSpawn(argv, callback)
  }

  if (util.isFunction(callback)) {
    var chunks = []
    task.stdout.on('data', function (chunk) { chunks.push(chunk) })
    task.stdout.on('end', function () {
      var data = Buffer.concat(chunks)
      callback(null, data)
    })
    task.stdout.on('error', function () {
      callback(new Error('error while reading plantuml output'), null)
    })
  }

  return task
}
