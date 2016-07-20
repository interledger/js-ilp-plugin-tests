'use strict'

const assert = require('chai').assert
const testPlugin = require('..')

const Plugin = testPlugin.plugin
const opts = testPlugin.opts[0]
let plugin = null

describe('Plugin info', function () {
  it('should instantiate a plugin', function () {
    plugin = new Plugin(opts)
    assert.isObject(plugin)
  })

  it('should connect the plugin', function * () {
    yield plugin.connect()
    assert.isTrue(plugin.isConnected())
  })

  describe('getInfo', function () {
    it('should be a function', function () {
      assert.isFunction(plugin.getInfo)
    })

    it('should return a promise to object with correct fields', function * () {
      const p = yield plugin.getInfo()
      assert.isObject(p)
      assert.isString(p.precision, 'should contain "precision"')
      assert.isString(p.scale, 'should contain "scale"')
      assert.isString(p.currencyCode, 'should contain "currencyCode"')
      assert.isString(p.currencySymbol, 'should contain "currencySymbol"')
    })
  })

  describe('getBalance', function () {
    it('should be a function', function () {
      assert.isFunction(plugin.getBalance)
    })

    it('should return to number stored as a string', function * () {
      const p = yield plugin.getBalance()
      assert.isString(p)
      assert.isFalse(isNaN(p - 0), 'should be a number in string form')
    })
  })

  describe('getConnectors', function () {
    it('should be a function', function () {
      assert.isFunction(plugin.getConnectors)
    })
  
    it('should return promise to array of strings', function * () {
      const p = yield plugin.getConnectors()
      assert.isArray(p)
      for (e of p) {
        assert.isString(e)
      }
    })
  })
})