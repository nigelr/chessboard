/**
 * Module dependencies.
 */

var express = require('express')
        , memoryStore = express.session.MemoryStore;

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieDecoder());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(express.session({ secret: 'ephoxIsCool', store: memoryStore }));

});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// board generation

var board = {
  pieces: {}

  , create: function () {
    this.buildBackRow("1", "W");
    this.buildPawnRow("2", "W");
    for (var col = 3; col <= 6; col ++) {
      this.buildBlankRow(col)
    }
    this.buildPawnRow("7", "B");
    this.buildBackRow("8", "B");
    return board.pieces;
  }

  , buildBackRow: function (row, color) {
    for (var col = 0; col < 8; col ++) {
      board.pieces[board.col_labels[col] + row] = color + board.row_pieces[col];
    }
  }

  , buildPawnRow: function (row, color) {
    for (var col = 0; col < 8; col ++) {
      board.pieces[board.col_labels[col] + row] = color + "P";
    }
  }

  , buildBlankRow: function (row) {
    for (var col = 0; col < 8; col ++) {
      board.pieces[board.col_labels[col] + row] = "";
    }
  }
  , col_labels: ["a", "b", "c", "d", "e", "f", "g", "h"]
  , row_pieces: ["R", "N", "B", "Q", "K", "B", "N", "R"]
}

// Routes

app.get('/reset', function(req, res) {
  res.send(board.create());
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}