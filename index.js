const Discord = require('discord.js');
const { fstat } = require('fs');
const ytdl = require("ytdl-core");
const fs = require("fs");
const bdd = require("./bdd.json");

const moment = require("moment");

const Client = new Discord.Client();

const prefix = "!";

Client.on("ready", async () => {
    console.log("Bot opérationel")
})

    //ping
    Client.on("message", async message => {
        let args = message.content.trim().split(/ +/g)

        if (message.content === prefix + "ping") {
            message.delete()
            console.log("commande ping par " + message.author.tag)
            let time = Date.now();
            await message.channel.send("Chargement...").then(async(m) => await m.edit(`Latence du bot : ${Date.now() - time} ms\nAPI de Discord : ${Client.ws.ping} ms`))
        }
    })

Client.on("message", msg => {
    if (msg.author.bot) return;
    
    const strmess = msg.toString().toLocaleLowerCase().split(" ");
    const no_word = ["fdp", "tg", "pd", "negro", "enculé", "salope", "pute"];
    const filtre = strmess.find((word) => { return no_word.includes(word) });

    if (filtre) {
        msg.delete();
    }

    if(msg.content.startsWith(prefix + "b")){
        msg.delete()
        if(msg.member.hasPermission("MANAGE_MESSAGES")){
            if(msg.content.length > 5){
                base_de_donnee = msg.content.slice(3)
                bdd["Base de donnée"] = base_de_donnee
                Savebdd()
            }        
        }
    }

        /*******************************************
        ************* COMMANDE MUSIQUE *************
        ********************************************/

    if (msg.content.startsWith(prefix + "play")) {
        msg.delete();
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

        /*******************************************
        ************* COMMANDE ADMIN ***************
        ********************************************/

    if (msg.member.hasPermission("ADMINISTRATOR")) {
        if (msg.content.startsWith(prefix + "ban")) {
            msg.delete();
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
            msg.delete();
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
            msg.delete();
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                mention.roles.add("725082898876858490");
                msg.channel.send(mention.displayName + " Mute avec succès")
            }
        }
        else if (msg.content.startsWith(prefix + "unmute")) {
            msg.delete();
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                mention.roles.remove("725082898876858490");
                msg.channel.send(mention.displayName + " unmute avec succès.")
            }
        }
        else if (msg.content.startsWith(prefix + "tempmute")) {
            msg.delete();
            let mention = msg.mentions.members.first();

            if (mention == undefined) {
                msg.reply("Membre non ou mal mentionné");
            }
            else {
                let args = msg.content.split(" ");

                mention.roles.add("725082898876858490");
                setTimeout(function () {
                    mention.roles.remove("725082898876858490");
                    msg.channel.send("<@" + mention.id + "> tu peux désormais parler de nouveau !");
                }, args[2] * 1000);
            }
        }

        /*******************************************
        ************* COMMANDE CLEAR ***************
        ********************************************/

        if (msg.content.startsWith(prefix + "clear")) {
            msg.delete();
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {

                let args = msg.content.trim().split(/ +/g);

                if (args[1]) {
                    if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                        msg.channel.bulkDelete(args[1])                   
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
         }}

        /*******************************************
        ************* COMMANDE INFO ****************
        ********************************************/

        if(msg.content === prefix + "info"){
            msg.delete();
            if (msg.mentions.users.first()) {
                user = msg.mentions.users.first();
            } else {
                user = msg.author;
            }
            const member = msg.guild.member(user);
            
            const embed = new Discord.MessageEmbed()
            .setColor('#ff5555')
            .setThumbnail(user.avatarURL)
            .setTitle(`Information sur ${user.username}#${user.discriminator} :`)
            .addField('ID du compte:', `${user.id}`, true)
            .addField('Pseudo sur le serveur :', `${member.nickname ? member.nickname : 'Aucun'}`, true)
            .addField('A crée son compte le :', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
            .addField('A rejoint le serveur le :', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
            .addField('Roles :', member.roles.cache.map(roles => `${roles.name}`).join(', '), true)
            .addField(`En réponse a :`,`${msg.author.username}#${msg.author.discriminator}`, true)
        msg.channel.send(embed).then(msg => msg.delete({ timeout: 30000 }));
        }

        /*******************************************
         *************COMMANDE HELP*****************
         *******************************************/
        if (msg.content === prefix + "help"){
            msg.delete();
            var embed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("**__Voici les commandes du bot :__**")
                    .setDescription("Vous pouvez utilisez mes commandes avec le prefix !")
                    .addField("**info**", "```Permet d'obtenir des informations sur l'utilisateur```")
                    .addField("**play**", "```Permet de jouer de la musique en collant une URL```")
                    .addField("**ban**", "```Permet de ban un utilisateur```")
                    .addField("**mute**", "```Permet de mute un utilisateur```")
                    .addField("**tempmute**", "```Permet de mute un utilisateur temporairement```")
                    .addField("**kick**", "```Permet d'expulser un utilisateur du serveur```")
                    .addField("**clear (x)**", "```Permet de supprimer un nombre de messages```")
                    .setTimestamp()
                    .setFooter("made by LeBoss")
                msg.author.send(embed)
                msg.channel.send("les commandes du bot vous ont été envoyé en privé")
            console.log("commande bot envoyé")
            msg.delete();
     }
})
/*Client.on("ready", async () =>{
    console.log("le bot est allumé")
    Client.user.setStatus("dnd")
    // Client.user.setActivity("Un porno", {type: "WATCHING"} );*/

        /*******************************************
        ************* COMMANDE STATUS **************
        ********************************************/

    Client.on("ready", () => {
    const statuses = [
        () => `SARD sur ${Client.guilds.cache.size} servers`,
        () => `${Client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users | !help`
    ]
    let i = 0
    setInterval(() => {
        Client.user.setActivity(statuses[i](), { type: "STREAMING", url: "https://www.twitch.tv/sardoche" })
        i = ++i % statuses.length
    }, 1e4)
});

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

        /*******************************************
        ************* MEMBERS COUNT ****************
        ********************************************/

Client.on("ready",() => {
    const channelId = "772136766336663573"

    const updateMembers = (guild) => {
        // console.log(guild)
        const channel = guild.channels.cache.get(channelId)
        channel.setName(`Members: ${guild.memberCount.toLocaleString()}`)
    }
    Client.on("guildMemberAdd", (member) => {
    console.log(member.guild)    
        updateMembers(member.guild)})
    Client.on("guildMemberRemove", (member) => {
    console.log(member.guild)       
        updateMembers(member.guild)
    })
    const guild = Client.guilds.cache.get("724763161659572227")
    updateMembers(guild)
})


Client.login("NzY1NjUzOTY4Mzg1OTk4ODc5.X4X80w.zMlybRY7PcyJGQvWbghWgk1Q0Mo");


