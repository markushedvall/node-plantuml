#!/usr/bin/env node
'use strict'

var path = require('path')
var shell = require('shelljs')

var JAVA = 'java -Djava.awt.headless=true -jar'
var PLANTUML_JAR = path.join(__dirname, '../../vendor/plantuml.jar')
var TEST_PUML = path.join(__dirname, 'test.puml')

shell.exec(JAVA + ' ' + PLANTUML_JAR + ' ' + TEST_PUML)
