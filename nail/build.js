#!/usr/bin/env node
'use strict'

var path = require('path')
var shell = require('shelljs')

var DIR = __dirname
var PLANTUML_JAR = path.join(DIR, '../vendor/plantuml.jar')
var NAILGUN_JAR = path.join(DIR, '../node_modules/node-nailgun-server/vendor/nailgun.jar')
var PLANTUML_NAIL_JAR = path.join(DIR, 'plantumlnail.jar')
var PLANTUML_NAIL_JAVA = path.join(DIR, 'PlantumlNail.java')
var PLANTUML_NAIL_CLASS = 'PlantumlNail.class'

shell.exec('javac -cp ' + PLANTUML_JAR + ':' + NAILGUN_JAR + ' ' + PLANTUML_NAIL_JAVA)
shell.exec('jar -cfM ' + PLANTUML_NAIL_JAR + ' -C ' + DIR + ' ' + PLANTUML_NAIL_CLASS)
shell.exec('rm ' + path.join(DIR, PLANTUML_NAIL_CLASS))
