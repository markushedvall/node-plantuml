/* global describe it */
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const plantuml = require('../lib/node-plantuml')

const TEST_PUML = path.join(__dirname, 'fixtures/test.puml')
const TEST_PNG = path.join(__dirname, 'fixtures/test.png')

const expect = chai.expect

function isBuffersEqual (buf1, buf2) {
  if (buf1.length !== buf2.length) return false
  for (let i = 0; i < buf1.length; i++) {
    if (buf1[i] !== buf2[i]) return false
  }
  return true
}

describe('node-plantuml', function () {
  describe('#generate()', function () {
    it('should generate file into png stream', function (done) {
      const expectedBuffer = fs.readFileSync(TEST_PNG)
      const gen = plantuml.generate(TEST_PUML, { format: 'png' })

      const chunks = []
      gen.out.on('data', function (chunk) { chunks.push(chunk) })
      gen.out.on('end', function () {
        const buffer = Buffer.concat(chunks)
        const eq = isBuffersEqual(buffer, expectedBuffer)
        expect(eq).to.equal(true)
        done()
      })
    })
    it('should generate to png when there are no options', function (done) {
      const expectedBuffer = fs.readFileSync(TEST_PNG)
      const gen = plantuml.generate(TEST_PUML)

      const chunks = []
      gen.out.on('data', function (chunk) { chunks.push(chunk) })
      gen.out.on('end', function () {
        const buffer = Buffer.concat(chunks)
        const eq = isBuffersEqual(buffer, expectedBuffer)
        expect(eq).to.equal(true)
        done()
      })
    })
  })
  describe('#encode()', function () {
    it('should encode "A -> B: Hello"', function (done) {
      plantuml.encode('A -> B: Hello', function (err, encoded) {
        expect(err).to.equal(null)
        expect(encoded).to.equal('SrJGjLDmibBmICt9oGS0')
        done()
      })
    })
  })
})
