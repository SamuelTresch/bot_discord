const Discord = require('discord.js');
const ytdl = require("ytdl-core");

const Client = new Discord.Client();

const prefix = "!";

Client.on("ready", () => {
    console.log("bot opérationnel");
});

Client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content == prefix + "tik") {
        msg.reply("tak");
    }

    const strmess = msg.toString().toLocaleLowerCase().split(" ");
    const no_word = ["fdp", "tg", "pd", "negro", "enculé", "salope", "pute"];
    const filtre = strmess.find((word) => { return no_word.includes(word) });

    if (filtre) {
        msg.delete();
        msg.reply("message supprimé")
    }

    if (msg.content == prefix + "stat") {
        msg.channel.send("" + msg.author.username + " qui a pour identifiant : " + msg.author.id + "  tu es beau sache le ! ");
    }

    if (msg.content.startsWith(prefix + "play")) {
        if (msg.member.voice.channel) {
            msg.member.voice.channel.join().then(connection => {
                let args = msg.content.split(" ");

                if (!args[1]) {
                    msg.reply("Lien de la video non ou mal mentionné.");
                    connection.disconnect();
                }
                else {
                    let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio" }));

                    dispatcher.on("finish", () => {
                        dispatcher.destroy();
                        connection.disconnect();
                    });

                    dispatcher.on("error", err => {
                        console.log("erreur de dispatcher : " + err);
                    });
                }
            }).catch(err => {
                msg.reply("Erreur lors de la connexion : " + err);
            });

        }
        else {
            msg.reply("Vous n'êtes pas connécté en vocal.");
        }
    }

    if (msg.member.hasPermission("ADMINISTRATOR")) {
        if (msg.content.startsWith(prefix + "ban")) {
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné.");
            }
            else {
                if (mention.bannable) {
                    mention.ban();
                    msg.channel.send(mention.displayName + " a été banni avec succès");
                }
                else {
                    msg.reply("Impossible de bannir se membre.");
                }
            }
        }
        else if (msg.content.startsWith(prefix + "kick")) {
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné.");
            }
            else {
                if (mention.kickable) {
                    mention.kick();
                    msg.channel.send(mention.displayName + " a été kick avec succès.");
                }
                else {
                    msg.reply("Impossible de kick ce membre.");
                }
            }
        }
        else if (msg.content.startsWith(prefix + "mute")) {
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                mention.roles.add("766387927281434644");
                msg.channel.send(mention.displayName + " Mute avec succès")
            }
        }
        else if (msg.content.startsWith(prefix + "unmute")) {
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                mention.roles.remove("766387927281434644");
                msg.channel.send(mention.displayName + " unmute avec succès.")
            }
        }
        else if (msg.content.startsWith(prefix + "tempmute")) {
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                let args = msg.content.split(" ");

                mention.roles.add("766387927281434644");
                setTimeout(function () {
                    mention.roles.remove("766387927281434644");
                    msg.channel.send("<@" + mention.id + "> tu peux désormais parler de nouveau !");
                }, args[2] * 1000);
            }
        }

        if (msg.content.startsWith(prefix + "clear")) {
            msg.delete();
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {

                let args = msg.content.trim().split(/ +/g);

                if (args[1]) {
                    if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                        msg.channel.bulkDelete(args[1])
                        msg.channel.send(`Vous avez supprimé ${args[1]} message(s)`)
                    }
                    else {
                        msg.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
                    }
                }
                else {
                    msg.channel.send(`Vous devez indiquer un nombre de messages a supprimer !`)
                }
            }
            else {
                msg.channel.send(`Vous devez avoir la permission de gérer les messages pour éxécuter cette commande !`)
            }
        }
    }
})

Client.on("ready", () => {
    const statuses = [
        () => `${Client.guilds.cache.size} serveurs`,
        () => `${Client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        Client.user.setActivity(statuses[i](), { type: "PLAYING" })
        i = ++i % statuses.length
    }, 1e4)
});

Client.login("NzY1NjUzOTY4Mzg1OTk4ODc5.X4X80w.zMlybRY7PcyJGQvWbghWgk1Q0Mo");