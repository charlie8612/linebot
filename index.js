var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: "1575634603",
  channelSecret: "40a947b68125981511d53b79fc7c3715",
  channelAccessToken: "87ibYMGCYy8ByvOu9zvo9biEyUu4FqDJb8nTRXak39+9ooH+QWW0BaFY1PZMLNWyl3n46J/mHkX+4hiC/yQlm95KwImGI0dFEM+w5ffkjBvxExPoRGzddPRFlJD+XNaXYPTvb0FoKNathqpBIClyMQdB04t89/1O/w1cDnyilFU=+Rg2XPnvxLNGaPcnRt8lDEl3n46J/mHkX+4hiC/yQlm95KwImGI0dFEM+w5ffkjBtjT4d60C4TnzD+ogPGrFQDO7iVIv7eN4Bw9h8i/ZsQngdB04t89/1O/w1cDnyilFU="
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
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
