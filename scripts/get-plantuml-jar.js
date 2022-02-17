#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const download = require('./download')

const PACKAGE_JSON_PATH = path.join(__dirname, '../package.json')
const plantumlVersion = require(PACKAGE_JSON_PATH).plantumlVersion

const JAR_DIR_PATH = path.join(__dirname, '../vendor')
const PLANTUML_JAR = path.join(JAR_DIR_PATH, 'plantuml.jar')

const PLANTUML_FILES_URL = 'https://sourceforge.net/projects/plantuml/files/'
const PLANTUML_FILES_JAR_PATH = plantumlVersion + '/plantuml.' + plantumlVersion + '.jar'

if (!fs.existsSync(JAR_DIR_PATH)) {
  fs.mkdirSync(JAR_DIR_PATH)
}

console.log('Downloading plantuml.jar version ' + plantumlVersion)
download(PLANTUML_FILES_URL + PLANTUML_FILES_JAR_PATH, PLANTUML_JAR, true)
