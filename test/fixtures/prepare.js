#!/usr/bin/env node
'use strict'

var path = require('path')
var shell = require('shelljs')

var JAVA = 'java -Djava.awt.headless=true -jar'
var INCLUDED_PLANTUML_JAR = path.join(__dirname, '../../vendor/plantuml.jar')
var PLANTUML_JAR = process.env.PLANTUML_HOME || INCLUDED_PLANTUML_JAR
var TEST_PUML = path.join(__dirname, 'test.puml')

shell.exec(JAVA + ' ' + PLANTUML_JAR + ' ' + TEST_PUML)
