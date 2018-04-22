var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: "1575634603",
  channelSecret: "40a947b68125981511d53b79fc7c3715",
  channelAccessToken: "6G81KFdx3hwhrkyBEvuKbogbk8rI6J0EWHPcQgVh6f+Rg2XPnvxLNGaPcnRt8lDEl3n46J/mHkX+4hiC/yQlm95KwImGI0dFEM+w5ffkjBtjT4d60C4TnzD+ogPGrFQDO7iVIv7eN4Bw9h8i/ZsQngdB04t89/1O/w1cDnyilFU="
});

bot.on('message', function(event) {
    console.log("message, event trigger!");
    console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
