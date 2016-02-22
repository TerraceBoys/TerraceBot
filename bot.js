var HTTPS = require('https');
var giphy = require('giphy-api')(); // api key goes here
var botID = process.env.BOT_ID;
var parthArray = ["http://s20.postimg.org/yl6qw2bml/24973_345810622060_2388172_n.jpg",
"http://s20.postimg.org/3n5oi30il/35265_412838317060_5577178_n.jpg", 
"http://s20.postimg.org/6wk3ojom5/35265_412838322060_1141727_n.jpg",
"http://s20.postimg.org/um9jd8mzh/35265_412838327060_8307595_n.jpg",
"http://s20.postimg.org/uq3cthsgt/35265_412838337060_1290307_n.jpg",
"http://s20.postimg.org/gq1b1cqql/35265_412838342060_5152058_n.jpg",
"http://s20.postimg.org/8gpfmxx0d/943509_10201433690910379_1806118327_n.jpg",
"http://s20.postimg.org/fzd69bdr1/965080_10201154670525879_688342159_o.jpg",
"http://s20.postimg.org/70dx4su3h/1013862_10152103898984262_1691110312_n.jpg",
"http://s20.postimg.org/5b4twqee5/12314446_10208006229383288_7296666242040685180_o.jpg",
"http://s20.postimg.org/v0l0ulw7x/017eb4dd_8d37_4043_8d8e_c5fd549a5b35.png",
"http://s20.postimg.org/izzktvot9/1125x1500_jpeg_bec7b79afca54fe496502f7f08b4e633.jpg",
"http://s20.postimg.org/vyvtsv9st/11110593_10204167242961442_5272107608490811576_o.jpg",
"http://s20.postimg.org/j8rlfs1ul/1669912_10205303466215898_8276503356576062106_o.jpg"]

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
  var parthPic = /koos/i;
  var koosBot = /KoosBot/i;

  
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
  } else if (koosBot.test(request.name)) {
    this.res.writeHead(200);
    setTimeout(function() {
      postMessage("Fuck off");
    }, 1500);
    this.res.end();
  } else if (request.text && statusCheck.test(request.text)) {
    this.res.writeHead(200);
    setTimeout(function() {
      var name = request.name.substring(0, request.name.indexOf(' ')) || "dude"; 
      postMessage("Ayyyyy lmao what's up " + name);
    }, 1500);
    this.res.end();
  } else if (request.text && parthPic.test(request.text)) {
    this.res.writeHead(200);
    var x = Math.floor((Math.random()*parthArray.length));
    setTimeout(function() {
      // postMessage(parthArray[x]);
      postMessage("Stump the Trump");
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
