/* global describe it */
const path = require('path')
const chai = require('chai')
const shell = require('shelljs')

const expect = chai.expect

const INDEX_JS = path.join(__dirname, '/../index.js')
const PUML = 'node ' + INDEX_JS

describe('node-plantuml CLI', function () {
  describe('#encode', function () {
    it('should encode "A -> B: Hello"', function () {
      const cli = shell.exec(PUML + ' encode "A -> B: Hello"', { silent: true })
      expect(cli.stdout).to.equal('SrJGjLDmibBmICt9oGS0\n')
    })
  })
})
