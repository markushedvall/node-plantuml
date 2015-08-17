#!/usr/bin/env node
'use strict'

var path = require('path')
var shell = require('shelljs')

var PLANTUML_JAR = path.join(__dirname, '../vendor/plantuml.jar')
var NAILGUN_JAR = path.join(__dirname, '../node_modules/node-nailgun-server/vendor/nailgun.jar')
var PLANTUML_NAIL_JAR = path.join(__dirname, 'plantumlnail.jar')
var PLANTUML_NAIL_JAVA = path.join(__dirname, 'PlantumlNail.java')
var PLANTUML_NAIL_CLASS = path.join(__dirname, 'PlantumlNail.class')

shell.exec('javac -cp ' + PLANTUML_JAR + ':' + NAILGUN_JAR + ' ' + PLANTUML_NAIL_JAVA)
shell.exec('jar -cf ' + PLANTUML_NAIL_JAR + ' ' + PLANTUML_NAIL_CLASS)
shell.exec('rm ' + PLANTUML_NAIL_CLASS)
