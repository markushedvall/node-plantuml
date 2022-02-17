#!/usr/bin/env node
'use strict'

const path = require('path')
const shell = require('shelljs')

const JAVA = 'java -Djava.awt.headless=true -jar'
const INCLUDED_PLANTUML_JAR = path.join(__dirname, '../../vendor/plantuml.jar')
const PLANTUML_JAR = process.env.PLANTUML_HOME || INCLUDED_PLANTUML_JAR
const TEST_PUML = path.join(__dirname, 'test.puml')

shell.exec(JAVA + ' ' + PLANTUML_JAR + ' ' + TEST_PUML)
