"use strict";

/*
** Import Packages
*/
const server = require("express")();
const bot_express = require("bot-express");

const linebot = require('linebot');
/*
** Middleware Configuration
*/
var server_port = server.listen(process.env.PORT || 8080, function() {
  var the_web_port = server_port.address().port;
  console.log("App now running on port", the_web_port);
});

var bot = linebot({
  channelId: "1575634603",
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
});
bot.listen('/linewebhook', 3000);
bot.on('message', function(event) {
    console.log("message, event trigger!");
    event.reply(event.message.text).then(function (data) {
    // success
    console.log(event);
    }).catch(function (error) {
    // error
    console.log("ERROR!");
    });
})

/*
** Mount bot-express
*/
server.use("/", bot_express({
    nlu: {
        type: "dialogflow",
        options: {
            client_access_token: process.env.DIALOGFLOW_CLIENT_ACCESS_TOKEN,
            language: "ch-tw"
        }
    },
    memory: {
        type: "memory-cache",
        retention: 600
    },
    line_channel_secret: process.env.LINE_CHANNEL_SECRET,
    line_access_token: process.env.LINE_ACCESS_TOKEN,
    facebook_app_secret: process.env.FACEBOOK_APP_SECRET,
    facebook_page_access_token: [
        {page_id: process.env.FACEBOOK_PAGE_ID, page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN}
    ],
    default_skill: process.env.DEFAULT_SKILL,
    google_project_id: process.env.GOOGLE_PROJECT_ID,
    google_api_key: process.env.GOOGLE_API_KEY,
    auto_translation: process.env.AUTO_TRANSLATION
}));

module.exports = server;
