var memwatch = require('memwatch-next');
memwatch.on('leak', function(info) {
  console.log("Leak Detected")
  console.log(info)
});

var timeoutHandle;

var iron_mq = require('iron_mq'),
    imq = new iron_mq.Client({
        token: "OOPjd5Pl5i7Kfltu5OebEAfcY10",
        project_id: "55a697286d8ad9000a0000dc"
    }),
    queue = imq.queue("test");

function worker(){

  function onDelete(err){
    if(err){
      console.log(err);
    }
  }

  function onGet(err, message){
    var deletedMessages = {};

    function onHandle(err){
      if (err) {
        console.log(err);
      }
      if (!deletedMessages[message.id]) {
        deletedMessages[message.id] = message.id;
        queue.del(message.id, onDelete);
      }
      worker();
    }

    if(err){
      console.log(err);
      timeoutHandle = setTimeout(worker, 5000);
    }
    else if(message){
      console.log("Processing " + message);
      onHandle()
    }
    else{
      console.log("queue complete");
      timeoutHandle = setTimeout(worker, 1000);
    }
  }

  queue.get({}, onGet);
}

console.log("Starting queue");
worker();








