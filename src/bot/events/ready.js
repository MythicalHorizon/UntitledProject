const chalk = require('chalk');
const ms = require('ms');
const { channels, settings } = require('../../conf');
const { status } = require('../../conf').settings;

    //===================
    //  Global Variable
    //===================

    const apiPingIntervalTime = ms('2s');

    //===================
    //  EVENT
    //===================

module.exports = async bot => {
    console.info(chalk.greenBright(`${bot.user.tag} is ready!`));
    bot.user.setActivity(status.title, {type: status.type.toUpperCase(), url: status.url});

    bot.xpDelay.clear();

    bot.guilds.cache.find(g => g.id === settings.guild).channels.cache.find(c => c.id === channels.allGuilds)
    .edit({name: `➤ ALL GUILDS: ${bot.guilds.cache.filter(g => g.id !== settings.guild).size}`});
    bot.guilds.cache.find(g => g.id === settings.guild).channels.cache.find(c => c.id === channels.allMembers)
    .edit({name: `➤ ALL MEMBERS: ${bot.users.cache.filter(m => !m.bot).size}`});

    setInterval(() => {
        bot.guilds.cache.find(g => g.id === settings.guild).channels.cache.find(c => c.id === channels.apiPing)
        .edit({name: `➤ API Ping: ${ms(bot.ws.ping)}`}).catch(err => console.error(err));
    }, apiPingIntervalTime);
};