const { MessageEmbed } = require("discord.js")
const botConfig = require('../../../Config.js')
const api = require('../../Constants/api.js')
const osu = require('../../Constants/osuapi.js')
const mysql = require('../../Constants/mysql.js')
const mapstatus = require('../../Constants/mapstatus.js')
const modreplace = require('../../Constants/modreplace.js')
const ranks = require('../../Constants/ranks.js')
const modEnum = require('../../Functions/mods_enum.js')
const timeago = require('../../Functions/time_ago.js')
const completed = require('../../Functions/completed.js')
const score = require('../../Functions/score_format.js')
const stars = require('../../Functions/stars.js')

module.exports = {
    name: "rxr",
    aliases: ['rsx','relaxrecent'],
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

        message.channel.send("Searching recent play...").then(async msg => {
            api().get('get_player_info', {
                params: {
                name: user.replace(re, '_'),
                scope: 'all'
                }
            })
            .then(function (playerinfo) {
                api().get('get_player_scores', {
					params: {
					  id: playerinfo.data.player.info.id,
					  scope: 'recent',
                      mode: 4,
					  limit: 1
					}
				  })
				.then(async function (recentinfo) {
                    let modsfixed = await osu().get('get_beatmaps', {
                            params: {
                                k: botConfig.apikey,
                                b: recentinfo.data.scores[0].beatmap.id,
                                mods: modreplace(recentinfo.data.scores[0].mods)
                            }
                        });

                    const embed = new MessageEmbed()
                        .setColor('#B65FCF')
                        .setAuthor({ name: `Most recent osu!Relax play for ${playerinfo.data.player.info.name}`, iconURL: `https://a.mixdev.online/${playerinfo.data.player.info.id}`})
                        .setDescription(`1. ${stars(modsfixed.data[0].difficultyrating,recentinfo.data.scores[0].beatmap.mode)} **[${recentinfo.data.scores[0].beatmap.title}](https://osu.ppy.sh/b/${recentinfo.data.scores[0].beatmap.id})** (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: recentinfo.data.scores[0].mods}).mod_text}\` • ${score(recentinfo.data.scores[0].score)}\n${ranks(recentinfo.data.scores[0].grade)} *${recentinfo.data.scores[0].beatmap.version}* • **${Number((recentinfo.data.scores[0].pp).toFixed(2))}pp** • x${recentinfo.data.scores[0].max_combo}/${recentinfo.data.scores[0].beatmap.max_combo}\n${Number((recentinfo.data.scores[0].acc).toFixed(2))}% \`[ ${recentinfo.data.scores[0].n300} • ${recentinfo.data.scores[0].n100} • ${recentinfo.data.scores[0].n50} • ${recentinfo.data.scores[0].nmiss} ]\``)
                        .setThumbnail(`https://assets.ppy.sh/beatmaps/${recentinfo.data.scores[0].beatmap.set_id}/covers/list@2x.jpg`);
                    
                    if(recentinfo.data.scores[0].grade == "F") {
                        embed.setFooter({ text: `${mapstatus(recentinfo.data.scores[0].beatmap.status).toString()} • Completed: ${completed(recentinfo.data.scores[0].time_elapsed,recentinfo.data.scores[0].beatmap.total_length)}% • ${timeago(recentinfo.data.scores[0].play_time)}`});
                    } else {
                        embed.setFooter({ text: `${mapstatus(recentinfo.data.scores[0].beatmap.status).toString()} • ${timeago(recentinfo.data.scores[0].play_time)}`});
                    }

                    msg.delete();
                    message.channel.send({embeds: [embed]});

				}).catch(function (error) {
					msg.edit(`User **${user}** doesn't have any recent play!`);
				});
			}).catch(function (error) {
				msg.edit(`User **${user}** doesn't exist`);
			});
        })
    }
}