/**
 * Module dependencies.
 */

require.paths.unshift(__dirname);

var express = require('express')
    , board = require('board')
    , fs = require('fs');

var app = module.exports = express.createServer();


// Configuration

app.configure(function() {
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Load Board function

function load_board(callback) {
  fs.readFile('board.hash', function(err, data) {
    if (err) {
      console.log("Missing");
      board.pieces = {};
    }
    else {
      board.pieces = JSON.parse(data);
    }
    callback();
  })
}

// Routes

app.get('/reset', function(req, res) {
  console.log("Reset");
  board.create();
  res.send(board.pieces);
});

app.get('/', function(req, res) {
  console.log("Root");
  load_board(function () {
    res.send(board.pieces);
  });
});

app.get('/show/:pos', function(req, res) {
  console.log("Show");
  load_board(function () {
    pos = req.params.pos
    ret = {}
    ret[pos] = board.pieces[pos]
    res.send(ret)
  });
});

app.get('/move/:from/:to', function(req, res) {
  console.log("Move");
  load_board(function () {
    res.send({removed: board.move(req.params.from, req.params.to)})
    board.save();
  })
})

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}