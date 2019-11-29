'use strict'

const ndjson = require('iterable-ndjson')
const configure = require('../lib/configure')
const toIterable = require('../lib/stream-to-iterable')
const toCamel = require('../lib/object-to-camel')

module.exports = configure(({ ky }) => {
  return async function * ls (path, options) {
    if (path && path.type) {
      options = path
      path = null
    }

    path = path || []
    path = Array.isArray(path) ? path : [path]
    options = options || {}

    const searchParams = new URLSearchParams(options.searchParams)
    searchParams.set('stream', true)
    path.forEach(p => searchParams.append('arg', `${p}`))
    if (options.type) searchParams.set('type', options.type)

    const res = await ky.post('pin/ls', {
      timeout: options.timeout,
      signal: options.signal,
      headers: options.headers,
      searchParams
    })

    for await (const pin of ndjson(toIterable(res.body))) {
      // For nodes that do not understand the `stream option`
      if (pin.Keys) {
        for (const hash of Object.keys(pin.Keys)) {
          yield { hash, type: pin.Keys[hash].Type }
        }
        return
      }
      yield toCamel(pin)
    }
  }
})
