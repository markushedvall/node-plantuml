#!/usr/bin/env node
'use strict'

const path = require('path')
const shell = require('shelljs')

const DIR = __dirname
const PLANTUML_JAR = path.join(DIR, '../vendor/plantuml.jar')
const NAILGUN_JAR = path.join(DIR, '../node_modules/node-nailgun-server/vendor/nailgun.jar')
const PLANTUML_NAIL_JAR = path.join(DIR, 'plantumlnail.jar')
const PLANTUML_NAIL_JAVA = path.join(DIR, 'PlantumlNail.java')
const PLANTUML_NAIL_CLASS = 'PlantumlNail.class'

shell.exec('javac -cp ' + PLANTUML_JAR + ':' + NAILGUN_JAR + ' ' + PLANTUML_NAIL_JAVA)
shell.exec('jar -cfM ' + PLANTUML_NAIL_JAR + ' -C ' + DIR + ' ' + PLANTUML_NAIL_CLASS)
shell.exec('rm ' + path.join(DIR, PLANTUML_NAIL_CLASS))
