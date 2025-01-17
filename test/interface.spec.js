/* eslint-env mocha */
'use strict'

const tests = require('interface-ipfs-core')
const isNode = require('detect-node')
const CommonFactory = require('./utils/interface-common-factory')
const isWindows = process.platform && process.platform === 'win32'

describe('interface-ipfs-core tests', () => {
  const defaultCommonFactory = CommonFactory.createAsync()

  tests.bitswap(defaultCommonFactory, {
    skip: [
      // bitswap.stat
      {
        name: 'should not get bitswap stats when offline',
        reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
      },
      // bitswap.wantlist
      {
        name: 'should not get the wantlist when offline',
        reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
      },
      // bitswap.unwant
      {
        name: 'should remove a key from the wantlist',
        reason: 'FIXME why is this skipped?'
      },
      {
        name: 'should not remove a key from the wantlist when offline',
        reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
      }
    ]
  })

  tests.block(defaultCommonFactory, {
    skip: [{
      name: 'should get a block added as CIDv1 with a CIDv0',
      reason: 'go-ipfs does not support the `version` param'
    }]
  })

  tests.bootstrap(defaultCommonFactory)

  tests.config(defaultCommonFactory, {
    skip: [
      // config.replace
      {
        name: 'replace',
        reason: 'FIXME Waiting for fix on go-ipfs https://github.com/ipfs/js-ipfs-http-client/pull/307#discussion_r69281789 and https://github.com/ipfs/go-ipfs/issues/2927'
      },
      {
        name: 'should list config profiles',
        reason: 'TODO: Not implemented in go-ipfs'
      },
      {
        name: 'should strip private key from diff output',
        reason: 'TODO: Not implemented in go-ipfs'
      }
    ]
  })

  tests.dag(defaultCommonFactory, {
    skip: [
      // dag.tree
      {
        name: 'tree',
        reason: 'TODO vmx 2018-02-22: Currently the tree API is not exposed in go-ipfs'
      },
      // dag.get:
      {
        name: 'should get a dag-pb node local value',
        reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
      },
      {
        name: 'should get dag-pb value via dag-cbor node',
        reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
      },
      {
        name: 'should get by CID string + path',
        reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
      },
      {
        name: 'should get only a CID, due to resolving locally only',
        reason: 'FIXME: go-ipfs does not support localResolve option'
      }
    ]
  })

  tests.dht(defaultCommonFactory, {
    skip: [
      // dht.findpeer
      {
        name: 'should fail to find other peer if peer does not exist',
        reason: 'FIXME checking what is exactly go-ipfs returning https://github.com/ipfs/go-ipfs/issues/3862#issuecomment-294168090'
      },
      // dht.findprovs
      {
        name: 'should take options to override timeout config',
        reason: 'FIXME go-ipfs does not support a timeout option'
      },
      // dht.get
      {
        name: 'should get a value after it was put on another node',
        reason: 'FIXME go-ipfs errors with  Error: key was not found (type 6) https://github.com/ipfs/go-ipfs/issues/3862'
      }
    ]
  })

  tests.filesRegular(defaultCommonFactory, {
    skip: [
      // .addFromFs
      isNode ? null : {
        name: 'addFromFs',
        reason: 'Not designed to run in the browser'
      },
      // .catPullStream
      {
        name: 'should export a chunk of a file',
        reason: 'TODO not implemented in go-ipfs yet'
      },
      {
        name: 'should export a chunk of a file in a Pull Stream',
        reason: 'TODO not implemented in go-ipfs yet'
      },
      {
        name: 'should export a chunk of a file in a Readable Stream',
        reason: 'TODO not implemented in go-ipfs yet'
      }
    ]
  })

  tests.filesMFS(defaultCommonFactory, {
    skip: [
      {
        name: 'should ls directory with long option',
        reason: 'TODO unskip when go-ipfs supports --long https://github.com/ipfs/go-ipfs/pull/6528'
      },
      {
        name: 'should read from outside of mfs',
        reason: 'TODO not implemented in go-ipfs yet'
      },
      {
        name: 'should ls from outside of mfs',
        reason: 'TODO not implemented in go-ipfs yet'
      }
    ]
  })

  tests.key(defaultCommonFactory, {
    skip: [
      // key.export
      {
        name: 'export',
        reason: 'TODO not implemented in go-ipfs yet'
      },
      // key.import
      {
        name: 'import',
        reason: 'TODO not implemented in go-ipfs yet'
      }
    ]
  })

  tests.miscellaneous(defaultCommonFactory, {
    skip: [
      // stop
      {
        name: 'should stop the node',
        reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
      }
    ]
  })

  tests.name(CommonFactory.createAsync({
    spawnOptions: {
      args: ['--offline']
    }
  }), {
    skip: [
      // stop
      {
        name: 'should resolve a record from peerid as cidv1 in base32',
        reason: 'TODO not implemented in go-ipfs yet: https://github.com/ipfs/go-ipfs/issues/5287'
      }
    ]
  })

  tests.namePubsub(CommonFactory.createAsync({
    spawnOptions: {
      args: ['--enable-namesys-pubsub'],
      initOptions: { bits: 1024, profile: 'test' }
    }
  }), {
    skip: [
      // name.pubsub.cancel
      {
        name: 'should cancel a subscription correctly returning true',
        reason: 'go-ipfs is really slow for publishing and resolving ipns records, unless in offline mode'
      },
      // name.pubsub.subs
      {
        name: 'should get the list of subscriptions updated after a resolve',
        reason: 'go-ipfs is really slow for publishing and resolving ipns records, unless in offline mode'
      }
    ]
  })

  tests.object(defaultCommonFactory)

  tests.pin(defaultCommonFactory)

  tests.ping(defaultCommonFactory, {
    skip: [
      {
        name: 'should fail when pinging an unknown peer over pull stream',
        reason: 'FIXME go-ipfs return success with text: Looking up peer <cid>'
      },
      {
        name: 'should fail when pinging peer that is not available over readable stream',
        reason: 'FIXME go-ipfs return success with text: Looking up peer <cid>'
      },
      {
        name: 'should fail when pinging a peer that is not available',
        reason: 'FIXME go-ipfs return success with text: Looking up peer <cid>'
      }
    ]
  })

  tests.pubsub(CommonFactory.createAsync({
    spawnOptions: {
      args: ['--enable-pubsub-experiment'],
      initOptions: { bits: 1024, profile: 'test' }
    }
  }), {
    skip: isWindows ? [
      // pubsub.subscribe
      {
        name: 'should send/receive 100 messages',
        reason: 'FIXME https://github.com/ipfs/interface-ipfs-core/pull/188#issuecomment-354673246 and https://github.com/ipfs/go-ipfs/issues/4778'
      },
      {
        name: 'should receive multiple messages',
        reason: 'FIXME https://github.com/ipfs/interface-ipfs-core/pull/188#issuecomment-354673246 and https://github.com/ipfs/go-ipfs/issues/4778'
      }
    ] : null
  })

  tests.repo(defaultCommonFactory)

  tests.stats(defaultCommonFactory)

  tests.swarm(defaultCommonFactory)
})
