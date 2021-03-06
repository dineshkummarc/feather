(function() {
  
  /**
   * @namespace Utility namespace for the framework
   * @name feather.util
   */
  feather.ns("feather.util");
  
  /**
   * Dynamically load script resources, with callback.
   * Options: <pre class="code">
   * {
   *    callback: function() {},
   *    files: ['filename.ext']
   * }
   * </pre>
   * @param {Object} options
   */
  feather.util.loadScripts = function(options) {
    var sem;
    if (options.callback) {
      sem = new feather.Semaphore(options.callback);
      sem.semaphore = options.files.length;
    }
    _.each(options.files, function(file) {
      //TODO: create a server side API that will let us get multiple files in 1 batch request (with caching)
      $.getScript(file, function() {
        sem.execute();
      });      
    });
  };

  /**
   * Dynamically load stylesheets
   */
  feather.util.loadStylesheet = function(href) {
    if (document.createStyleSheet) {
      document.createStyleSheet(href);
    } else {
      $("head").append("<link rel='stylesheet' type='text/css' href='" + href + "' />");
    }
  };
  
})();
