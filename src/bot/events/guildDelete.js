const { settings, channels } = require("../../conf");

module.exports = async bot => {
    bot.guilds.cache.find(g => g.id === settings.guild).channels.cache.find(c => c.id === channels.allGuilds)
    .edit({name: `➤ ALL GUILDS: ${bot.guilds.cache.filter(g => g.id !== settings.guild).size}`});
}