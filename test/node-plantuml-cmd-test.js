/* global describe it */
var path = require('path')
var chai = require('chai')
var shell = require('shelljs')

var expect = chai.expect

var INDEX_JS = path.join(__dirname, '/../index.js')
var PUML = 'node ' + INDEX_JS

describe('node-plantuml CLI', function () {
  describe('#encode', function () {
    it('should encode "A -> B: Hello"', function () {
      var cli = shell.exec(PUML + ' encode "A -> B: Hello"', {silent: true})
      expect(cli.output).to.equal('UDfpLD2rKt2oKl18pSd91m0KGWDz\n')
    })
  })
})
