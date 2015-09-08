/* global describe it */
var fs = require('fs')
var path = require('path')
var chai = require('chai')
var plantuml = require('../lib/node-plantuml')

var TEST_PUML = path.join(__dirname, 'fixtures/test.puml')
var TEST_PNG = path.join(__dirname, 'fixtures/test.png')

var expect = chai.expect

function isBuffersEqual (buf1, buf2) {
  if (buf1.length !== buf2.length) return false
  for (var i = 0; i < buf1.length; i++) {
    if (buf1[i] !== buf2[i]) return false
  }
  return true
}

describe('node-plantuml', function () {
  describe('#generate()', function () {
    it('should generate file into png stream', function (done) {
      var expectedBuffer = fs.readFileSync(TEST_PNG)
      var gen = plantuml.generate(TEST_PUML, { format: 'png' })

      var chunks = []
      gen.out.on('data', function (chunk) { chunks.push(chunk) })
      gen.out.on('end', function () {
        var buffer = Buffer.concat(chunks)
        var eq = isBuffersEqual(buffer, expectedBuffer)
        expect(eq).to.equal(true)
        done()
      })
    })
  })
})
