'use strict'

var plantumlExecutor = require('./plantuml-executor')
var fs = require('fs')
var stream = require('stream')
var util = require('util')
var path = require('path')
var plantumlEncoder = require('plantuml-encoder')

var DECODE = '-decodeurl'
var PIPE = '-pipe'
var UNICODE = '-tutxt'
var ASCII = '-ttxt'
var SVG = '-tsvg'
var EPS = '-eps'
var CONFIG = '-config'
var TESTDOT = '-testdot'
var DOT = '-graphvizdot'
var CHARSET = '-charset'

var CONFIGS = {
  classic: path.join(__dirname, '../resources/classic.puml'),
  monochrome: path.join(__dirname, '../resources/monochrome.puml')
}

module.exports.useNailgun = plantumlExecutor.useNailgun

function PlantumlEncodeStream () {
  stream.Transform.call(this)
  this.chunks = []
}

util.inherits(PlantumlEncodeStream, stream.Transform)

PlantumlEncodeStream.prototype._transform = function (chunk, encoding, done) {
  this.chunks.push(chunk)
  done()
}

PlantumlEncodeStream.prototype._flush = function (done) {
  var uml = Buffer.concat(this.chunks).toString()
  var encoded = plantumlEncoder.encode(uml)
  this.push(Buffer.from(encoded, 'ascii'))
  done()
}

function isPath (input) {
  try {
    fs.lstatSync(input)
    return true
  } catch (e) {
    return false
  }
}

function arrangeArguments (input, options, callback) {
  if (typeof input === 'function') {
    callback = input
    input = undefined
  } else {
    if (typeof options === 'function') {
      callback = options
      options = undefined
    }
    if (typeof input !== 'string' && !(input instanceof String)) {
      options = input
      input = undefined
    }
  }

  return {
    input: input,
    options: options,
    callback: callback
  }
}

function joinOptions (argv, options) {
  options.format = options.format || 'png'
  switch (options.format) {
    case 'ascii':
      argv.push(ASCII)
      break
    case 'unicode':
      argv.push(UNICODE)
      break
    case 'svg':
      argv.push(SVG)
      break
    case 'eps':
      argv.push(EPS)
      break
    case 'png':
    default:
      break
  }

  if (options.config) {
    var template = CONFIGS[options.config]
    var file = template || options.config
    argv.push(CONFIG)
    argv.push(file)
  }

  if (options.dot) {
    argv.push(DOT)
    argv.push(options.dot)
  }

  if (options.charset) {
    argv.push(CHARSET)
    argv.push(options.charset)
  }

  return argv
}

function generateFromStdin (child) {
  return {
    in: child.stdin,
    out: child.stdout
  }
}

function generateFromFile (path, child) {
  var rs = fs.createReadStream(path)
  rs.pipe(child.stdin)

  return {
    out: child.stdout
  }
}

function generateFromText (text, child) {
  child.stdin.write(text)
  child.stdin.end()

  return {
    out: child.stdout
  }
}

module.exports.generate = function (input, options, callback) {
  var args = arrangeArguments(input, options, callback)
  input = args.input
  options = args.options || {}
  callback = args.callback

  var o = joinOptions([PIPE], options)
  var child = plantumlExecutor.exec(o, options.include, callback)

  if (!input) {
    return generateFromStdin(child)
  } else {
    if (isPath(input)) {
      return generateFromFile(input, child)
    } else {
      return generateFromText(input, child)
    }
  }
}

function encodeFromStdin (encodeStream) {
  return {
    in: encodeStream,
    out: encodeStream
  }
}

function encodeFromFile (path, encodeStream) {
  var rs = fs.createReadStream(path)
  rs.pipe(encodeStream)

  return {
    out: encodeStream
  }
}

function encodeFromText (text, encodeStream) {
  encodeStream.write(text)
  encodeStream.end()

  return {
    out: encodeStream
  }
}

module.exports.encode = function (input, options, callback) {
  var args = arrangeArguments(input, options, callback)
  input = args.input
  options = args.options || {}
  callback = args.callback

  var encodeStream = new PlantumlEncodeStream()

  if (typeof callback === 'function') {
    var chunks = []
    encodeStream.on('data', function (chunk) { chunks.push(chunk) })
    encodeStream.on('end', function () {
      var data = Buffer.concat(chunks)
      callback(null, data.toString())
    })
  }

  if (!input) {
    return encodeFromStdin(encodeStream)
  } else {
    if (isPath(input)) {
      return encodeFromFile(input, encodeStream)
    } else {
      return encodeFromText(input, encodeStream)
    }
  }
}

module.exports.decode = function (encoded, callback) {
  var child = plantumlExecutor.exec([DECODE, encoded], callback)

  return {
    out: child.stdout
  }
}

module.exports.testdot = function (callback) {
  var child = plantumlExecutor.exec([TESTDOT])

  var chunks = []
  child.stdout.on('data', function (chunk) { chunks.push(chunk) })
  child.stdout.on('end', function () {
    var data = Buffer.concat(chunks)
    var dotOkCheck = 'Installation seems OK. File generation OK'
    var dotOk = data.toString().indexOf(dotOkCheck) !== -1
    if (typeof callback === 'function') callback(dotOk)
  })

  return {
    out: child.stdout
  }
}
