#!/usr/bin/env node
'use strict'

var path = require('path')
var shell = require('shelljs')

var PLANTUML_JAR = path.join(__dirname, '../vendor/plantuml.jar')
var NAILGUN_JAR = path.join(__dirname, '../node_modules/node-nailgun-server/vendor/nailgun.jar')
var PLANTUML_NAIL_JAR = path.join(__dirname, 'plantumlnail.jar')
var PLANTUML_NAIL_JAVA = path.join(__dirname, 'PlantumlNail.java')
var PLANTUML_NAIL_CLASS = 'PlantumlNail.class'

shell.exec('javac -cp ' + PLANTUML_JAR + ':' + NAILGUN_JAR + ' ' + PLANTUML_NAIL_JAVA)
shell.exec('jar -cfM ' + PLANTUML_NAIL_JAR + ' -C ' + __dirname + ' ' + PLANTUML_NAIL_CLASS)
shell.exec('rm ' + path.join(__dirname, PLANTUML_NAIL_CLASS))
