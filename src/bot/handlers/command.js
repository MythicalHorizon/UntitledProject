const chalk = require('chalk');
const { readdirSync } = require("fs");

module.exports = (bot) => {
    let cNum = 0;
    const load = (dirs) => {
        try{
            const commands = readdirSync(`src/bot/commands/${dirs}/`).filter(d => d.endsWith('.js'));

            for(let file of commands){
                let pull = require(`../commands/${dirs}/${file}`);
                bot.commands.set(pull.config.name, pull);
                if(pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name));
                cNum++;
            };
        }catch(err){
            console.error(`Nie mozna znalezc folderow.\nW folderze 'src/bot/commands/' musi sie znajdowac chociaz 1 folder.\n`);
        }
    };
    readdirSync('src/bot/commands/').filter(d => !d.includes('.'))
    .forEach(d => load(d));

    if(cNum <= 0) console.warn(chalk.redBright("No commands to load!"));
    else console.info(chalk.greenBright(`Loaded ${chalk.cyan(cNum)} commands.`));
};