const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    config: {
        name: 'example',
        info: 'Przykładowa komenda.',
        category: 'glowne',
        aliases: ['test']
    },
    run: async (bot, msg) => {
        let pong = msg.channel.send('Testing...');
        (await pong).edit(`@v${Discord.version}, API: ${bot.ws.ping}ms, LOCAL: ${(await pong).createdTimestamp - msg.createdTimestamp}ms, UPTIME: ${ms(bot.uptime)}`);
    }
}