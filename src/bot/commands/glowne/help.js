const { MessageEmbed } = require('discord.js');
const { white } = require('../../../utils/colors.json');
const { readdirSync } = require('fs');

module.exports = {
    config: {
        name: 'pomoc',
        info: 'Pomoc bota - Opis wszystkich komend i funkcji.',
        category: 'glowne',
        aliases: ['help']
    },
    run: async (bot, msg, args) => {
        /** @todo Lepszy design komendy */

        if(!args[0]){
            let embed = new MessageEmbed()
            .setTitle('**Pomoc**')
            .setDescription(`\`${bot.prefix}pomoc glowne\` - Wszystkie komendy, które nie pasują do pozostałych kategorii.
            \`${bot.prefix}pomoc 4fun\` - Komendy 4FUN. Różnego typu komendy rozrywkowe.
            \`${bot.prefix}pomoc spolecznosc\` - Komendy społecznościowe oraz komendy związane z ekonomią.
            \`${bot.prefix}pomoc admin\` - Komendy administracyjne, dostępne tylko dla osób z odpowiednimi uprawnieniami Discorda.`)
            .setFooter(`Liczba komend: ${bot.commands.size}`)
            .setColor(white)
            .setTimestamp(new Date());

            msg.channel.send(embed);
        }else if(readdirSync('src/bot/commands/').filter(d => !d.includes('.')).includes(args[0])){ // Jeżeli podano nazwę modułu i jest zgodna z nazwami folderów w ./src/commands/.
            let embed = new MessageEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL())
            .setTitle(`**Pomoc => ${args[0].toUpperCase()}**`)
            .setDescription(`Komendy dla kategorii ${args[0]}`)
            .setColor(white)
            .setTimestamp(new Date());

            bot.commands.forEach(cmd => {
                if(!cmd.config.category === args[0]) return;
                embed.addField(cmd.config.name, `Opis: \`${cmd.config.info}\`\nAliasy: \`${cmd.config.aliases.join('`, `')}\``); // Wypisanie komend.
            });
            msg.channel.send(embed);
        }else{
            msg.channel.send(`Nie znaleziono takiej kategorii. (\`${args[0]}\`)`);
        }
    }
};