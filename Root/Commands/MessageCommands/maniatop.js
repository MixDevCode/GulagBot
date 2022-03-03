const { MessageEmbed } = require("discord.js")
const botConfig = require('../../../Config.js')
const api = require('../../Constants/api.js')
const osu = require('../../Constants/osuapi.js')
const mysql = require('../../Constants/mysql.js')
const modreplace = require('../../Constants/modreplace.js')
const ranks = require('../../Constants/ranks.js')
const modEnum = require('../../Functions/mods_enum.js')
const timeago = require('../../Functions/time_ago.js')
const score = require('../../Functions/score_format.js')
const stars = require('../../Functions/stars.js')

module.exports = {
    name: "maniatop",
    aliases: ['top'],
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

        message.channel.send("Searching top plays...").then(async msg => {
            let playerinfo = await api().get('get_player_info', {
				params: {
				  name: user.replace(re, '_'),
				  scope: 'all'
				}
			}).catch(function (error) {
				msg.edit(`User **${user}** doesn't exist`);
			});

            let bestinfo = await api().get('get_player_scores', {
				params: {
				  id: playerinfo.data.player.info.id,
				  scope: 'best',
                  mode: 3,
				  limit: 5
				}
			}).catch(function (error) {
				msg.edit(`User **${user}** doesn't exist`);
			});

            var description = "";
            for (let i = 0; i < bestinfo.data.scores.length; i++) {

                let modsfixed = await osu().get('get_beatmaps', {
                    params: {
                        k: botConfig.apikey,
                        b: bestinfo.data.scores[i].beatmap.id,
                        mods: modreplace(bestinfo.data.scores[i].mods)
                    }
                });
                description = description+`${i+1}. ${stars(modsfixed.data[0].difficultyrating,bestinfo.data.scores[i].beatmap.mode)} **[${bestinfo.data.scores[i].beatmap.title}](https://osu.ppy.sh/b/${bestinfo.data.scores[i].beatmap.id})** (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: bestinfo.data.scores[i].mods}).mod_text}\` • ${score(bestinfo.data.scores[i].score)}\n${ranks(bestinfo.data.scores[i].grade)} *${bestinfo.data.scores[i].beatmap.version}* • **${Number((bestinfo.data.scores[i].pp).toFixed(2))}pp** • x${bestinfo.data.scores[i].max_combo}\n${Number((bestinfo.data.scores[i].acc).toFixed(2))}% \`[ ${bestinfo.data.scores[i].ngeki} • ${bestinfo.data.scores[i].n300} • ${bestinfo.data.scores[i].nkatu} • ${bestinfo.data.scores[i].n100} • ${bestinfo.data.scores[i].n50} • ${bestinfo.data.scores[i].nmiss} ]\`\n\`${modsfixed.data[0].diff_size}K\` • ${timeago(bestinfo.data.scores[i].play_time)}\n\n`
            }

            const embed = new MessageEmbed()
                .setColor('#B65FCF')
                .setAuthor({ name: `Top osu!Mania plays for ${playerinfo.data.player.info.name}`, iconURL: `https://a.mixdev.online/${playerinfo.data.player.info.id}`})
                .setDescription(description)
                .setThumbnail(`https://a.mixdev.online/${playerinfo.data.player.info.id}?${Math.floor(Math.random()*9999)}`);
            
            msg.delete();
            message.channel.send({embeds: [embed]});

				
        })
    }
}