feather.ns("featherdoc");

(function() { 
  var currWidget = null;
  
  featherdoc.docengine = feather.Widget.create({
    name: "featherdoc.docengine",
    path: "widgets/docengine/",
    prototype: {
      onReady: function() {
        var me = this;
        me.docnav.on('nav', function(args) {
          me.loadDoc(args);
        });
      },
      loadDoc: function(options) {
        var me = this;
        var widgetName = "markdown";
        var docContainer = me.get('#documentContainer');
        if (! docContainer.hasClass('shadow'))
          docContainer.addClass('shadow');
        if (currWidget && currWidget.dispose) {
          console.log("Disposing widget");
          currWidget.dispose();
          currWidget = null;
          console.log("Widget disposed.");
        } else {
          docContainer.empty();
        }
        
        if (options.type === "api") {
          widgetName = null;
          docContainer.append('<iframe src="'+options.path+'" name="apidoc" id="apidoc-iframe" class="apidoc-iframe" />');
          var iframe = jQuery('#apidoc-iframe');
          iframe.height(window.innerHeight - iframe.offset().top - 10);
        }
        
        if (widgetName) {        
          feather.Widget.load({
            id: feather.id(),
            path:"widgets/"+widgetName+"/",
            serverOptions: {
              path: options.path,
              method: options.method
            },
            clientOptions: {
              container: docContainer,
              keepContainerOnDispose: true,
              on: {
                ready: function(args) {
                  currWidget = args.sender;
                }
              }
            }
          });
        } // end if.
      }
    }   
  }); 
})();
