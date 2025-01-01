module.exports = {
‎    config: {
‎        name: "hello",
‎        version: "1.0",
‎        author: "Siyabonga",
‎        countDown: 5,
‎        role: 0,
‎        shortDescription: "sarcasm",
‎        longDescription: "sarcasm",
‎        category: "reply",
‎    },
‎onStart: async function(){}, 
‎onChat: async function({
‎    event,
‎    message,
‎    getLang
‎}) {
‎    if (event.body && event.body.toLowerCase() == "hello") return message.reply("Hello my name is 😈Siya EI Prime Bot😈 . ☯️👑I'm a Prime of bots 👑☯️.I'm here to help you and to have fun. I was sent by my creator 👑https://www.facebook.com/thabo.siyabonga.dlamini.080726👑");
‎}
‎}; 
‎
