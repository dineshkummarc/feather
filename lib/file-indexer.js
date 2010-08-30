var sys = require("sys"),
    fs = require("fs");

exports.index = function(jojo, options, callback) {
  jojo.appDirectories = {};
  jojo.appFiles = {};
  jojo.jojoFiles = {};
  var topSem = new jojo.lang.semaphore(callback);
  var _readdir = function(path, _cb) {
    sys.puts("DIRECTORY: " + path);      
    fs.readdir(path, function(err, files) {
      if (!err) {
        _cb(err, path, files);
        topSem.decrement();
        topSem.execute();
      }
    });
  };
  topSem.increment();
  _readdir(options.publicRoot, function cb(err, path, files) {
    var dirs = [];
    var localSem = new jojo.lang.semaphore(function() {
      //all stats at this level have completed, "recurse" as needed (not true recursion as the "tail" call is actually async)
      dirs.forEach(function(dir) {
        _readdir(path + "/" + dir, cb);
      });
    });
    files.forEach(function(file) {
      var filePath = path + "/" + file;
      sys.puts(file);
      var fObj = {};
      jojo.appFiles[filePath] = fObj;
      if (file.indexOf(".jojo") > -1) {
        jojo.jojoFiles[filePath] = fObj;
        //register a file watcher to invalidate caches (or whatnot) when the file changes
        fs.watchFile(filePath, function(curr, prev) {
          jojo.event.eventDispatcher.fire("filechange:" + filePath, {curr: curr, prev: prev});
        });
      }
      //need to stat it
      topSem.increment();
      localSem.increment();
      fs.stat(filePath, function(err, stats) {
        if (err) {
          sys.puts("ERROR: " + err);
        }
        if (stats) {
          fObj.stats = stats;
          if (stats.isDirectory()) {
            dirs.push(file);
            topSem.increment();
            jojo.appFiles[filePath].isDirectory = true;
            jojo.appDirectories[filePath] = fObj;
          }
        }
        localSem.decrement();
        localSem.execute();
        topSem.decrement();
        topSem.execute();
      });
    });
  });
};