"use strict";

module.exports = class SkillHandleDeliveryOrder {
    constructor(){
        console.log("cons in");
        this.required_parameter = {
            menu: {
                message_to_confirm: {
                    line: {
                        type: "text",
                        text: "何色にしますか？"
                    },
                    return resolve("3333");
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
