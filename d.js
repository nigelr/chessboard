// Auto starts on file changes
// USAGE
// node d.js app.js

var sys = require('sys'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  path = require('path');
  util = require('util');

// Daemon class
function Daemon (args) {
  this.whatchedFiles = [];
  this._depQuene = [];
  this._process = null;
  
  this.childName = args[2];
  if (!args[2]) {
    sys.puts("Usage: node d.js server.js [params]");
    process.exit(1);
  }
  args.splice(0,2);
  this.childParams = args;
  
  this.collectDeps(this.childName);
}

// search for files to watch
Daemon.prototype.collectDeps = function (file) {
  this._depQuene.push(file);
  this.whatchedFiles.push(file);
  this._collectDeps();  
}
Daemon.prototype._collectDeps = function () {
  var file = this._depQuene.pop();
  
  var d = this;
  fs.readFile( file, function(err, data) { 
    var deps = {};
    var dir = path.dirname(file);
    
    while(match = /(?:^|[^\w-])require *\(\s*['"](\.\/|\.\.|\/)(.*?)['"]\s*\)/g.exec(data)) {
      var t = path.join(match[1] == '/'? '' : dir , (match[1] != "./"? match[1] : '') + match[2] + '.js');
      if (d.whatchedFiles.indexOf(t)==-1)
        deps[t] = true;
    }
    deps = Object.keys(deps);        
    deps.forEach(function(dep) {
      d._depQuene.push(dep);
      d.whatchedFiles.push(dep);
    });
    
    if (d._depQuene.length==0)
      d.startWatching();
    else
      d._collectDeps();
  });
}

// init file watching
Daemon.prototype.startWatching = function(argv) {
  var d = this;
  this.whatchedFiles.forEach(function(file) {
    fs.watchFile(file, function(curr, prev) {
      // Added to make work on OS X
      if(prev.mtime.toString() != curr.mtime.toString()) {
        sys.puts(file + " changed!");
        d.restartChild();
      }
    });
  });
  
  sys.puts("Daemon started.");
  sys.puts("Press enter anytime to restart script.");
  sys.puts("Press ctrl+c to exit Daemon.\n");
  
  this.startChild();
}

// spawn Daemon child
Daemon.prototype.startChild = function() {  
  this._process = spawn('node',this.childParams);
  this._process.stdout.addListener('data', function(data) {
    sys.print(data);
  });
  this._process.stderr.addListener('data', function(data) {
    sys.print(data);
  });
  var d = this;
  this._process.addListener('exit', function(code) {
    sys.puts("\033["+(code==0?32:31)+"mScript terminated. ("+code+")\033[m");
  });
}

// kill Daemon child
Daemon.prototype.killChild = function() {
  if (this._process && this._process.pid) this._process.kill();
}

// respawn Daemon child
Daemon.prototype.restartChild = function() {
  sys.puts("\033[34mRestarting script.\033[m");
  this.killChild();
  this.startChild();
}

// watch for enterpress
var stdin = process.openStdin();
stdin.setEncoding('utf8');
stdin.addListener('data', function (chunk) {
  if (chunk[chunk.length-1]=="\n")
    d.restartChild();
});

// start Daemon
var d = new Daemon(process.argv);

