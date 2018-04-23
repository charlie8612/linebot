// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const dialogflow = require("apiai-promisified");
const linebot = require('linebot');
// -----------------------------------------------------------------------------
//console.log(process.env.LINE_ACCESS_TOKEN);
//console.log(process.env.LINE_CHANNEL_SECRET);
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);
// var server_port = server.listen(process.env.PORT || 8080, function() {
//   var the_web_port = server_port.address().port;
//   console.log("App now running on port", the_web_port);
// });
// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// Dialogflowのクライアントインスタンスを作成
const nlu = new dialogflow(process.env.DIALOGFLOW_CLIENT_ACCESS_TOKEN, {language: "ja"});


/*var line_bot = linebot({
  channelId: "1575634603",
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
  channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
});
line_bot.listen('/linewebhook', 3000);
const linebotParser = line_bot.parser();*/
// -----------------------------------------------------------------------------
// ルーター設定
server.post('/linewebhook', line.middleware(line_config), (req, res, next) => {
    console.log("in post");
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // thread
    let events_processed = [];
    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            events_processed.push(
                nlu.textRequest(event.message.text, {sessionId: event.source.userId}).then((response) => {
                    if (response.result && response.result.action == "handle-delivery-order"){
                        let message;
                        if (response.result.parameters.menu && response.result.parameters.menu != ""){
                            message = {
                                type: "text",
                                text: `毎度！${response.result.parameters.menu}ね。どちらにお届けしましょ？`
                            }
                        } else {
                            message = {
                                type: "text",
                                text: `HIHI!!`
                            }
                        }
                        return bot.replyMessage(event.replyToken, message);
                    }
                })
            );
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});
/*var linebot = require('linebot');
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
});*/
