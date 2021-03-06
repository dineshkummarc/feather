exports.getWidget = function(feather, cb) {
  var channel1 = feather.socket.addChannel({id: "channel1"});

  var channel2 = feather.socket.addChannel({
    id: "channel2",
    bouncing: true
  });

  var channel3 = feather.socket.addChannel({
    id: "channel3",
    announceConnections: false,
    messages: ["test", "ack"]
  });

  var channel4 = feather.socket.addChannel({
    id: "channel4",
    bouncing: true,
    messages: ["test", "ack"]
  });

  var channel5 = feather.socket.addChannel({
    id: "channel5",
    allowDirectMessaging: true,
    allowGroups: true,
    messages: ["test", "ack", "ack2"]
  });

  var channel6 = feather.socket.addChannel({
    id: "channel6",
    allowDirectMessaging: true,
    allowGroups: true,
    hooks: {
      subscribe: function(args, cb) {
        if (args.data.allowSubscribe) {
          cb();
        } else {
          cb('not allowed');
        }
      },
      connect: function(args, cb) {
        if (args.data.allowConnect) {
          cb();
        } else {
          cb('not allowed');
        }
      },
      disconnect: function(args, cb) {
        cb(null, 'disconnected');
      },
      message: function(args, cb) {
        switch (args.message) {
          case "allowMessage":
            cb(null, args.data + ": augmented");
            break;
          case "disallowMessage":
            cb('not allowed');
            break;
          case "groupMessage":
            if (args.groupName === "goodGroup") {
              cb(null, args.data);
            } else {
              cb('group closed for the summer');
            }
            break;
          case "directMessage":
            if (args.data === "allow") {
              cb(null, args.data);
            } else if (args.data === "alterList") {
              //change toClients to send directly to self
              var clientId = channel6.clientIds[args.client.sessionId];
              cb(null, args.data + ": to self", [clientId]);
            } else {
              cb("direct message not allowed");
            }
            break;
          default:
            cb(null, args.data);
            break;
        }
      },
      invalidMessage: function(args, cb) {
        
      }
    }
  });

  cb(null, {
    name: "api_tester.channelTests",
    path: "widgets/channelTests/"
  });
};