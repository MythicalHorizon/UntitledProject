const { model, Schema } = require('mongoose');

/** @todo Dodać rzeczy dla profilu */

const userData = Schema({
    serverID: String,
    userID: String,
    userTag: String,
    userName: String,

    money: Number,
    xp: Number,
    xpMax: Number,
    xpAll: Number,
    lvl: Number,
    rep: Number,
    friends: Map,

    blacklist: Boolean
});

module.exports = model('userData', userData);