const Discord = require('discord.js');
const ytdl = require("ytdl-core");

const Client = new Discord.Client();

const prefix = "!";

Client.on("ready", () => {
    console.log("bot opérationnel");
});

Client.on("message", msg => {
  if(msg.author.bot) return;

  
  if(msg.content == prefix + "tik"){
     msg.reply("tak");
  }

  const strmess = msg.toString().toLocaleLowerCase().split(" ");
  const no_word = ["fdp","tg","pd"];
  const filtre = strmess.find(function(word)
                                { return no_word.includes(word)});

  if(filtre)
  {
    msg.delete();
    msg.reply("message supprimé")

  }

  if(msg.content == prefix + "stat"){
      msg.channel.send(""+ msg.author.username + "qui a pour identifiant : " + msg.author.id + " a posté un message ");
  }

  if(msg.content.startsWith(prefix + "play")){
      if(msg.member.voice.channel){
            msg.member.voice.channel.join().then(connection => {
                let args = msg.content.split(" ");
                 
                if(!args[1]){
                    msg.reply("Lien de la video non ou mal mentionné.");
                    connection.disconnect();
                }
                else {
                   let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio"}));
                  
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
});

Client.login("NzY1NjUzOTY4Mzg1OTk4ODc5.X4X80w.zMlybRY7PcyJGQvWbghWgk1Q0Mo");
 