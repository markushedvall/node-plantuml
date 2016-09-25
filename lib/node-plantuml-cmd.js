'use strict'

var fs = require('fs')
var os = require('os')
var commander = require('commander')
var plantuml = require('./node-plantuml')
var pack = require('../package.json')

function getFormatFromOptions (options) {
  if (options.unicode) {
    return 'unicode'
  } else if (options.ascii) {
    return 'ascii'
  } else if (options.svg) {
    return 'svg'
  } else if (options.eps) {
    return 'eps'
  }
  return 'png'
}

function generate (file, options) {
  options.format = getFormatFromOptions(options)
  var gen
  if (file) {
    gen = plantuml.generate(file, options)
  } else if (options.text) {
    options.text = '@startuml' + os.EOL + options.text + os.EOL + '@enduml'
    gen = plantuml.generate(options.text, options)
  } else {
    gen = plantuml.generate(options)
    process.stdin.pipe(gen.in)
  }

  if (options.output) {
    var fileStream = fs.createWriteStream(options.output)
    gen.out.pipe(fileStream)
  } else {
    gen.out.pipe(process.stdout)
  }
}

function encode (file, options) {
  var en
  if (file) {
    en = plantuml.encode(file)
  } else if (options.text) {
    en = plantuml.encode(options.text)
  } else {
    en = plantuml.encode()
    process.stdin.pipe(en.in)
  }

  if (en) {
    en.out.on('data', function (chunk) { process.stdout.write(chunk) })
    en.out.on('end', function () {
      process.stdout.write('\n')
    })
  }
}

function decode (url, options) {
  var de = plantuml.decode(url)
  de.out.pipe(process.stdout)
}

function testdot () {
  var dot = plantuml.testdot()
  dot.out.pipe(process.stdout)
}

commander.version(pack.version)

commander
  .command('generate [file]')
  .description('Generate an UML diagram from PlantUML source')
  .option('-p, --png', 'ouput an UML diagram as a PNG image')
  .option('-s, --svg', 'ouput an UML diagram as an SVG image')
  .option('-e, --eps', 'ouput an UML diagram as an EPS image')
  .option('-u, --unicode', 'ouput an UML diagram in unicode text')
  .option('-a, --ascii', 'ouput an UML diagram in ASCII text')
  .option('-o --output [file]', 'the file in which to save the diagram')
  .option('-c, --config [file]', 'config file read before the diagram')
  .option('-t, --text [text]', 'UML text to generate from')
  .option('-d, --dot [file]', 'specify Graphviz dot executable')
  .option('-i, --include [path]', 'specify the path to include from')
  .option('-C, --charset [charset]', 'specify the charset of PlantUML source')
  .action(generate)

commander
  .command('encode [file]')
  .description('Encodes PlantUML source')
  .option('-t, --text [text]', 'UML text to encode')
  .action(encode)

commander
  .command('decode <url>')
  .description('Decodes PlantUML source')
  .action(decode)

commander
  .command('testdot')
  .description('Test the installation of Graphviz dot')
  .action(testdot)

commander.parse(process.argv)

if (!process.argv.slice(2).length || process.argv[2] === 'help') {
  commander.outputHelp()
}
