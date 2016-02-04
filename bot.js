var HTTPS = require('https');
var giphy = require('giphy-api')(); // api key goes here
var botID = process.env.BOT_ID;

// Request attributes
// {"attachments":[],
// "avatar_url":"http://i.groupme.com/200x132.jpeg.45cfd3ac5ba242648f3961b89ce19c68",
// "created_at":1445374076,
// "group_id":"17311868",
// "id":"144537407603506323",
// "name":"Branden Rodgers",
// "sender_id":"21769018",
// "sender_type":"user",
// "source_guid":"9f0deb7bfc9b2d62919bff16c7828c09",
// "system":false,
// "text":"brobot?",
// "user_id":"21769018"}

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var statusCheck = /^brobot\?/i;
  var botAnimate = /^animate me /i;
  var parthPic = /parth/i;
  
  if (request.text && botAnimate.test(request.text)) {
    this.res.writeHead(200);
    getGif(request.text, function(err, gifyResponse) {
      if (!err) {
        setTimeout(function() {
          postMessage(gifyResponse);
        }, 1500);
      }
      else {
        console.log(err);
        postMessage("nah");
      }
    });
    this.res.end();
  } else if (request.text && statusCheck.test(request.text)) {
    this.res.writeHead(200);
    setTimeout(function() {
      var name = request.name.substring(0, request.name.indexOf(' ')) || "dude"; 
      postMessage("Ayyyyy lmao what's up " + name);
    }, 1500);
    this.res.end();
  } else if (request.text && billPic.test(request.text)) {
    this.res.writeHead(200);
    setTimeout(function() {
      postMessage("http://s20.postimg.org/j9rfeyr19/6358791836146480831571443913_bill_cosby_before_a.jpg");
    }, 1500);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}


function getGif(request, callback) {
  var searchText = request.substring(11);
  
  var options = {
    q: searchText,
    limit: 1,
    fmt: 'json'
  };

  giphy.search(options, function(err, res) {
    callback(false, res.data[0].images.original.url)
  });

}


function postMessage(message) {
  var botResponse = message;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
