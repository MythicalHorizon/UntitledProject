const userDataDB = require('./userData');

/** @todo Dodać rzeczy dla profilu */

module.exports = (msg) => {
    userDataDB.findOne({userID: msg.author.id}, async (err, data) => {
        if(err) console.error(err);

        if(data == null || data == undefined){
            const updateUserData = new userDataDB({
                serverID: msg.guild.id,
                userID: msg.author.id,
                userTag: msg.author.tag,
                userName: msg.author.username,
                lang: "en",

                money: 0,
                xp: 0,
                xpMax: 500,
                xpAll: 0,
                lvl: 1,
                rep: 0,
                friends: new Map(),

                blacklist: false
            });
            updateUserData.save()
            .catch(err => console.error(err));
        }
    });
};