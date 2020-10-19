const { settings, channels } = require("../../conf");

module.exports = async bot => {
    bot.guilds.cache.find(g => g.id === settings.guild).channels.cache.find(c => c.id === channels.allMembers)
    .edit({name: `➤ ALL MEMBERS: ${bot.users.cache.filter(m => !m.bot).size}`});
}