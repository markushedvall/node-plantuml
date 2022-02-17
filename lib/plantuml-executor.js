'use strict'

const childProcess = require('child_process')
const path = require('path')
const nailgun = require('node-nailgun-server')
const ngClient = require('node-nailgun-client')

const INCLUDED_PLANTUML_JAR = path.join(__dirname, '../vendor/plantuml.jar')
const PLANTUML_JAR = process.env.PLANTUML_HOME || INCLUDED_PLANTUML_JAR

const PLANTUML_NAIL_JAR = path.join(__dirname, '../nail/plantumlnail.jar')
const PLANTUML_NAIL_CLASS = 'PlantumlNail'

const LOCALHOST = 'localhost'
const GENERATE_PORT = 0

let nailgunServer
let clientOptions
let nailgunRunning = false

module.exports.useNailgun = function (callback) {
  const options = { address: LOCALHOST, port: GENERATE_PORT }
  nailgunServer = nailgun.createServer(options, function (port) {
    clientOptions = {
      host: LOCALHOST,
      port: port
    }

    ngClient.exec('ng-cp', [PLANTUML_JAR], clientOptions)
    ngClient.exec('ng-cp', [PLANTUML_NAIL_JAR], clientOptions)

    // Give Nailgun some time to load the classpath
    setTimeout(function () {
      nailgunRunning = true
      if (typeof callback === 'function') {
        callback()
      }
    }, 50)
  })

  return nailgunServer
}

// TODO: proper error handling
function execWithNailgun (argv, cwd, cb) {
  clientOptions.cwd = cwd || process.cwd()
  return ngClient.exec(PLANTUML_NAIL_CLASS, argv, clientOptions)
}

// TODO: proper error handling
function execWithSpawn (argv, cwd, cb) {
  cwd = cwd || process.cwd()
  const opts = [
    '-Dplantuml.include.path=' + cwd,
    '-Djava.awt.headless=true',
    '-jar', PLANTUML_JAR
  ].concat(argv)
  return childProcess.spawn('java', opts)
}

module.exports.exec = function (argv, cwd, callback) {
  if (typeof argv === 'function') {
    callback = argv
    argv = undefined
    cwd = undefined
  } else if (typeof cwd === 'function') {
    callback = cwd
    cwd = undefined
  }

  let task
  if (nailgunRunning) {
    task = execWithNailgun(argv, cwd, callback)
  } else {
    task = execWithSpawn(argv, cwd, callback)
  }

  if (typeof callback === 'function') {
    const chunks = []
    task.stdout.on('data', function (chunk) { chunks.push(chunk) })
    task.stdout.on('end', function () {
      const data = Buffer.concat(chunks)
      callback(null, data)
    })
    task.stdout.on('error', function () {
      callback(new Error('error while reading plantuml output'), null)
    })
  }

  return task
}
