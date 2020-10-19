const { readdirSync } = require('fs');

module.exports.collections = ['aliases', 'commands'];

module.exports.handlers = () => {
    return readdirSync("src/bot/handlers").filter(f => f.endsWith('.js'));
}