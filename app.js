/**
 * Module dependencies.
 */

require.paths.unshift(__dirname);

var express = require('express'),
    board = require('board');

var app = module.exports = express.createServer();


// Configuration

app.configure(function() {
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.cookieDecoder());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/reset', function(req, res) {
  res.send(board.create());
});

app.get('/', function(req, res) {
  res.send(board.create());
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}