console.clear();
console.info('Starting bot, please wait...\n');
const chalk = require('chalk');

    //===================
    //  Dodawanie prefixów do rodzajów console.log
    //===================

function proxy(context, method, msg){ 
    return function(){
        method.apply(context, [msg].concat(Array.prototype.slice.apply(arguments)))
    }
}
console.log = proxy(console, console.log, chalk.gray('[LOG]:'));
console.info = proxy(console, console.info, chalk.yellowBright('[@]:'));
console.warn = proxy(console, console.warn, chalk.keyword('orange')('[!]:'));
console.error = proxy(console, console.error, chalk.redBright('\n[ERROR]:  '));

    //===================
    //  Łączenie z bazą danych MongoDB.
    //===================

const db = require('mongoose');
db.connect('mongodb://localhost/untitled-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.info(chalk.greenBright('Connecting to database MongoDB...')))
.catch(err => console.error(chalk.redBright('Unable to connect to database MongoDB.\nCheck service status \'mongod\'')));

const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const { collections, handlers } = require('../utils/handlerDirs');
const { settings, channels } = require('../conf');
const Color = require('../utils/colors.json');
const { random } = require('../utils/utils');
const userData = require('./models/userData');
const setupUserData = require('./models/userData.setup');

    //===================
    //  Global Variable
    //===================

    const xpDelayTimeout = ms('10s');

    //===================
    //  Bot Client init
    //===================

const bot = new Discord.Client({
    shards: 'auto',
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    disableMentions: 'everyone'
});
bot.prefix = settings.prefix;
bot.xpDelay = new Set();

/**
 * @todo Xp spam protection
 */
// const xpLastMessage = new Map();

    //===================
    //  Inicjalizacja wszystkich handlerów i kolekcji.
    //===================

collections.forEach(c => bot[c] = new Discord.Collection());
handlers().forEach(h => require(`./handlers/${h}`)(bot));

bot.on('message', async (msg) => {
    if(msg.author.bot || msg.channel.type === 'dm') return;

    const args = msg.content.slice(bot.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //===================
    //  UserData SetUp
    //===================

    setupUserData(msg);

    //===================
    //  Bot Mention
    //===================

    if(msg.mentions.has(bot.user)){
        if(args[0] != undefined) return;
        
        let embed = new Discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL())
        .setDescription(`Prefx: \`${bot.prefix}\`\nPomoc: \`${bot.prefix}pomoc\``)
        .addField('**Linki**', `Spodobał Ci się bot? [Zaproś](https://discord.com/oauth2/authorize?client_id=550768728384733219&scope=bot&permissions=2146958591) go na swój serwer!
        [Serwer](https://discord.gg/MZ45bGm) Support bota.`)
        .setColor(Color.white)
        .setTimestamp(new Date());

        msg.channel.send(embed);
    }

    //===================
    //  Friends Command --> TEST
    //===================

    if(command === "friends"){
        userData.findOne({userID: msg.author.id}, (err, data) => {
            switch(args[0]){
                case "add":
                    break;
                case "remove":
                    break;
                case "list":
                    let embed = new Discord.MessageEmbed()
                    .setTitle('Lista Znajomych')
                    .setDescription('Lista wszystkich znajomych.')
                    .addField(`(${data.friends.size})`, `\`${data.friends.size > 0 ? [...data.friends.values()].join('`, `') : "Nie masz znajomych D:"}\``)
                    .setColor(Color.white)
                    .setTimestamp(new Date());

                    msg.channel.send(embed);
                    break;
                default:
                    break;
            }
        });
    }

    //===================
    //  System lvl i xp
    //===================

    if(!bot.xpDelay.has(msg.author.id) && !msg.content.startsWith(bot.prefix)){
        if(msg.content.trim().split(' ').length <= 1) return;

        userData.findOne({userID: msg.author.id}, (err, data) => {
            if(err) return console.error(err);
            if(data === undefined || data.xp === null) return;
            const randomXP = random(1, msg.content.trim().split(' ').length);
            data.xp += randomXP;
            data.xpAll += randomXP;

            if(data.xp >= data.xpMax){ // LvlUP
                data.xp = 0
                data.lvl++;
                data.xpMax += 100+data.lvl*2;
                data.money += 60;
            }

            data.save()
            .catch(err => console.error(err));
        });

        /**
         * @todo Xp spam protection
         */
        //trueLastMessage.set(msg.author.id, msg.content);
        bot.xpDelay.add(msg.author.id);
        setTimeout(() => {
            bot.xpDelay.delete(msg.author.id);
        }, xpDelayTimeout);
    }

    //===================
    //  CommandHandler
    //===================

    if(!msg.content.startsWith(bot.prefix)) return;
    let commandFile = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
    if(commandFile) commandFile.run(bot, msg, args);
});

bot.login(require('./auth.json').token);

module.exports = {
    bot: bot,
    userData: userData
}