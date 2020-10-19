const { readdirSync } = require("fs")

module.exports = (bot) => {   
    const events = readdirSync(`src/bot/events/`).filter(d => d.endsWith('.js'));
    for(let file of events){
        const evt = require(`../events/${file}`);
        let eName = file.split('.')[0];
        bot.on(eName, evt.bind(null, bot));
    };
};