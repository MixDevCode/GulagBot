const { MessageEmbed } = require("discord.js")
const api = require('../../Constants/api.js')
const ranks = require('../../Constants/ranks.js')
const level =  require('../../Functions/level.js')
const mysql = require('../../Constants/mysql.js')
const botConfig = require('../../../Config.js')

module.exports = {
    name: "taiko",
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
        message.channel.send("Searching user...").then(async msg => {

            let playercount = await api().get('get_player_info', {
                params: {
                  name: user.replace(re, '_'),
                  scope: 'all'
                }
              })
              .then(async function (playerinfo) {

                let statusinfo = await api().get('get_player_status', {
                    params: {
                        id: playerinfo.data.player.info.id
                    }
                    });
                
                if(statusinfo.data.player_status.online == false){
                    var status = "Offline";
                    var statuslink = "https://cdn.discordapp.com/emojis/891622774769066034.png";
                } else {
                    var status = "Online";
                    var statuslink = "https://cdn.discordapp.com/emojis/891622774651633695.png";
                }
                const embed = new MessageEmbed()
                    .setColor('#B65FCF')
                    .setDescription(`**osu!Taiko status for: [${playerinfo.data.player.info.name}](${botConfig.domain}/u/${playerinfo.data.player.info.id})**`)
                    .setThumbnail(`https://a.mixdev.online/${playerinfo.data.player.info.id}?${Math.floor(Math.random()*9999)}`)
                    .addFields(
                        { name: 'Performance', value: `--- **${playerinfo.data.player.stats[1].pp}pp**\n**Global Rank** #${playerinfo.data.player.stats[1].rank} (:flag_${playerinfo.data.player.info.country}: #${playerinfo.data.player.stats[1].country_rank})\n**Accuracy:** ${Number((playerinfo.data.player.stats[1].acc).toFixed(2))}%\n**Playcount:** ${playerinfo.data.player.stats[1].plays}\n**Level:** ${level(playerinfo.data.player.stats[1].rscore)}`, inline: true },
                        { name: 'Rank', value: `${ranks("SSH")}: ${playerinfo.data.player.stats[1].xh_count}\n${ranks("SS")}: ${playerinfo.data.player.stats[1].x_count}\n${ranks("SH")}: ${playerinfo.data.player.stats[1].sh_count}\n${ranks("S")}: ${playerinfo.data.player.stats[1].s_count}\n${ranks("A")}: ${playerinfo.data.player.stats[1].a_count}`, inline: true },
                    )
                    .setFooter({text: status, iconURL: statuslink });
            
                msg.delete();
                message.channel.send({embeds: [embed]});

              });
        })
    }
}