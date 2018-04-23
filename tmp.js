var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: "1575634603",
  channelSecret: channel Secret,
  channelAccessToken: channel Access Token
});

bot.on('message', function(event) {
    console.log("message, event trigger!");
    event.reply(event.message.text).then(function (data) {
    // success
    console.log(event);
    }).catch(function (error) {
    // error
    console.log("ERROR!");
    });
});

bot.listen('/linewebhook', 3000);

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server_port = app.listen(process.env.PORT || 8080, function() {
  var port = server_port.address().port;
  console.log("App now running on port", port);
});
