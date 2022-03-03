const { MessageEmbed } = require("discord.js")
const api = require('../../Constants/api.js')
const mysql = require('../../Constants/mysql.js')
const botConfig = require('../../../Config.js')

module.exports = {
    name: "osuavatar",
    run: async(client, message, args, container) => {
        var user = '';
        var find = ' ';
		var re = new RegExp(find, 'g');	
        if(!args[0]) {
            mysql().query("SELECT COUNT(1) AS exist FROM osu_users WHERE discord_id = '"+message.author.id+"'", async function (err, result) {
                if (err) throw err;
                        
                if(result[0].exist == 1){
                    mysql().query("SELECT osu_user FROM osu_users WHERE discord_id = '"+message.author.id+"'", await function (err, resultuser) {
                        if (err) throw err;
                        user = resultuser[0].osu_user;
                    });
                } else {
                    message.channel.send(`:negative_squared_cross_mark: ${message.author.username}, you need to write the username at least!`);
                }
            });	
        } else {
            if(args[0].toString().startsWith(`<@`) || args[0].toString().startsWith(`<@!`)) {
                let discordid = args[0].toString().replace('<@!','');
                discordid = discordid.replace('>','');
                mysql().query("SELECT COUNT(1) AS exist FROM osu_users WHERE discord_id = '"+discordid+"'", async function (err, result) {
                    if (err) throw err;
                            
                    if(result[0].exist == 1){
                        mysql().query("SELECT osu_user FROM osu_users WHERE discord_id = '"+discordid+"'", await function (err, resultuser) {
                            if (err) throw err;
                            user = resultuser[0].osu_user;
                        });
                    } else {
                        message.channel.send(`:negative_squared_cross_mark: User doesn't have any account linked!`);
                    }
                });
            } else {
                user = args.join(" ");
            }
        }

        message.channel.send("Searching avatar...").then(async msg => {
            api().get('get_player_info', {
                params: {
                name: user.replace(re, '_'),
                scope: 'all'
                }
            })
            .then(function (playerinfo) {
                    const embed = new MessageEmbed()
                        .setColor('#B65FCF')
                        .setAuthor({ name: `Avatar for ${playerinfo.data.player.info.name}`, url: `${botConfig.domain}/u/${playerinfo.data.player.info.id}`})
                        .setImage(`https://a.mixdev.online/${playerinfo.data.player.info.id}?${Math.floor(Math.random()*9999)}`);
                    msg.delete();
                    message.channel.send({embeds: [embed]});
			}).catch(function (error) {
				msg.edit(`User **${user}** doesn't exist`);
			});
        })
    }
}