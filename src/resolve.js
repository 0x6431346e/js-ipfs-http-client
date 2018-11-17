'use strict'

const promisify = require('promisify-es6')

const transform = function (res, callback) {
  callback(null, res.Path)
}

module.exports = (send) => {
  return promisify((args, opts, callback) => {
    if (typeof (opts) === 'function') {
      callback = opts
      opts = {}
    }

    opts = opts || {}

    const qs = {
      recursive: opts.r || opts.recursive,
      'cid-base': opts['cid-base'] || opts.cidBase
    }

    send.andTransform({
      path: 'resolve',
      args: args,
      qs
    }, transform, callback)
  })
}
