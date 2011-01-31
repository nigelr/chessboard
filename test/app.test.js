// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
        , assert = require('assert');

var default_board = {
                a1: 'WR', b1: 'WN', c1: 'WB', d1: 'WQ', e1: 'WK', f1: 'WB', g1: 'WN', h1: 'WR'
                , a2: 'WP', b2: 'WP', c2: 'WP', d2: 'WP', e2: 'WP', f2: 'WP', g2: 'WP', h2: 'WP'
                , a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: ''
                , a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: ''
                , a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: ''
                , a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: ''
                , a7: 'BP', b7: 'BP', c7: 'BP', d7: 'BP', e7: 'BP', f7: 'BP', g7: 'BP', h7: 'BP'
                , a8: 'BR', b8: 'BN', c8: 'BB', d8: 'BQ', e8: 'BK', f8: 'BB', g8: 'BN', h8: 'BR'
              }

module.exports = {
  'GET /reset - should create board and contents': function() {
    assert.response(app,
    { url: '/reset' },
    { status: 200, headers: { 'Content-Type': 'application/json' }}
            , function(res) {
              assert.eql(JSON.parse(res.body), default_board )
            });
  }
  , 'GET / - return entire board': function() {
    assert.response(app,
    { url: '/' },
    { status: 200, headers: { 'Content-Type': 'application/json' }}
            , function(res) {
              assert.eql(JSON.parse(res.body), default_board )
            });
  }
};