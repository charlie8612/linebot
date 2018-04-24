"use strict";

const debug = require("debug")("bot-express:skill");

module.exports = class SkillHandleDeliveryOrder {
    debug("\nBot Express\n");
    constructor(){
        this.required_parameter = {
            menu: {
                message_to_confirm: {
                    type: "template",
                    altText: "YYY",
                    template: {
                        type: "buttons",
                        text: "ご注文は？",
                        actions: [
                            {type: "message", label: "松", text: "松"},
                            {type: "message", label: "竹", text: "竹"},
                            {type: "message", label: "梅", text: "梅"}
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    console.log("parser");
                    if (["松", "竹", "梅"].includes(value)) {
                        return resolve(value);
                    }

                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    console.log("reaction");
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `あいよっ！${value}ね。`
                    });
                    return resolve();
                }
            },
            address: {
                message_to_confirm: {
                    type: "text",
                    text: "どちらにお届けしましょっ？"
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    console.log("add-parser");
                    if (typeof value == "string"){
                        return resolve(value);
                    } else if (typeof value == "object" && value.type == "location"){
                        return resolve(value.address);
                    } else {
                        return reject();
                    }
                }
            }
        }
    }

    finish(bot, event, context, resolve, reject){
        return bot.reply({
            type: "text",
            text: `あいよっ。じゃあ${context.confirmed.menu}を30分後くらいに${context.confirmed.address}にお届けしますわ。おおきに。`
        }).then((response) => {
            return resolve(response);
        });
    }

}
