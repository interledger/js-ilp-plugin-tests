'use strict'

const assert = require('chai').assert
const testPlugin = require('..')

const Plugin = testPlugin.plugin

const optsA = testPlugin.options[0].pluginOptions
const optsB = testPlugin.options[1].pluginOptions
const transferA = testPlugin.options[0].transfer
const transferB = testPlugin.options[1].transfer
const timeout = testPlugin.timeout

describe('Plugin messaging', function () {
  beforeEach(function * () {
    this.pluginA = new Plugin(optsA)
    this.pluginB = new Plugin(optsB)

    const pA = new Promise(resolve => this.pluginA.once('connect', resolve))
    this.pluginA.connect()
    yield pA

    const pB = new Promise(resolve => this.pluginB.once('connect', resolve))
    this.pluginB.connect()
    yield pB

    assert.isTrue(this.pluginA.isConnected())
    assert.isTrue(this.pluginB.isConnected())

    this.prefix = yield this.pluginA.getPrefix()
    this.timeout += timeout
  })

  afterEach(function * () {
    if (this.pluginA.isConnected()) yield this.pluginA.disconnect()
    if (this.pluginB.isConnected()) yield this.pluginB.disconnect()
  })

  describe('sendMessage', function () {
    it('should be a function', function () {
      assert.isFunction(this.pluginA.sendMessage)
    })

    it('should send a simple message', function (done) {
      this.pluginB.once('incoming_message', (message) => {
        assert.deepEqual(message, {
          ledger: this.prefix,
          account: transferB.account,
          data: {foo: 'bar'}
        })
        done()
      })

      this.pluginA.sendMessage({
        ledger: this.prefix,
        account: transferA.account,
        data: {foo: 'bar'}
      }).catch(done)
    })

    it('should reject message missing `ledger`', function (done) {
      this.pluginA.sendTransfer({
        account: transferA.account,
        data: {foo: 'bar'}
      }).catch((e) => {
        assert.equal(e.name, 'InvalidFieldsError')
        done()
      }).catch(done)
    })

    it('should reject message with an incorrect `ledger`', function (done) {
      this.pluginA.sendTransfer({
        ledger: 'fail',
        account: transferA.account,
        data: {foo: 'bar'}
      }).catch((e) => {
        assert.equal(e.name, 'InvalidFieldsError')
        done()
      }).catch(done)
    })

    it('should reject message missing `account`', function (done) {
      this.pluginA.sendTransfer({
        ledger: this.prefix,
        data: {foo: 'bar'}
      }).catch((e) => {
        assert.equal(e.name, 'InvalidFieldsError')
        done()
      }).catch(done)
    })

    it('should reject message missing `data`', function (done) {
      this.pluginA.sendTransfer({
        ledger: this.prefix,
        account: transferA.account
      }).catch((e) => {
        assert.equal(e.name, 'InvalidFieldsError')
        done()
      }).catch(done)
    })
  })
})
