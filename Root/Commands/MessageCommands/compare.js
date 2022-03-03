const { MessageEmbed } = require("discord.js")
const botConfig = require('../../../Config.js')
const api = require('../../Constants/api.js')
const osu = require('../../Constants/osuapi.js')
const mysql = require('../../Constants/mysql.js')
const modreplace = require('../../Constants/modreplace.js')
const ranks = require('../../Constants/ranks.js')
const modEnum = require('../../Functions/mods_enum.js')
const timeago = require('../../Functions/time_ago.js')
const bid = require('../../Functions/beatmapid.js')
const score = require('../../Functions/score_format.js')
const stars = require('../../Functions/stars.js')

module.exports = {
    name: "compare",
    aliases: ['c'],
    run: async(client, message, args, container) => {
        var user = '';
        var find = ' ';
		var re = new RegExp(find, 'g');
		var linkarray = [];
		let x = 100;
		message.channel.messages.fetch({ limit: x }).then(async messages => {
			var links = [];
            messages.forEach(function(msg) {
				var embed = msg.embeds;
				if(embed.length > 0){
					var description = embed[0].description;
					if (typeof description !== 'undefined' && description !== null){
						var match = description.match(/https?:\/\/(www.|osu.|)ppy\.sh\/b[^)]+/g);
						if(match !== null) {
							links.push(match.toString().replace('\)\*\*',''))
						}
					}
					var author = embed[0].author;
					if (typeof author !== 'undefined' && author !== null){
							links.push(author.url)
					}
				}  
			});
			
			nameArr = links.toString().split(',')
			nameArr = nameArr.filter(e => String(e).trim());
            linkarray.push(nameArr[0]);
		});
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
                        message.channel.send(`:negative_squared_cross_mark: This user doesn't have any account linked!`);
                    }
                });
            } else {
                user = args.join(" ");
            }
        }

        message.channel.send("Searching comparation..").then(msg => {
			let beatmaplink = linkarray.toString();
            api().get('get_player_info', {
				params: {
				  name: user.replace(re, '_'),
				  scope: 'all'
				}
			})
			.then(function (playerinfo) {
				api().get('get_map_info', {
					params: {
						id: bid(beatmaplink).id_beatmap
					}
				})
				.then(function (mapinfo) {
					api().get('get_player_scores', {
						params: {
						  id: playerinfo.data.player.info.id,
						  scope: 'best',
						  mode: bid(beatmaplink).mode,
						  md5: mapinfo.data.map.md5
						}
					})
					.then(async function (compareinfo) {
						let embeddesc = "";
						let modetext = "Standard";
						for (let i = 0; i < compareinfo.data.scores.length; i++) {
							let modsfixed = await osu().get('get_beatmaps', {
								params: {
									k: botConfig.apikey,
									b: compareinfo.data.scores[i].beatmap.id,
									mods: modreplace(compareinfo.data.scores[i].mods)
								}
							});
							if(compareinfo.data.scores[i].beatmap.mode == "3"){
								embeddesc = embeddesc+`${i+1}. ${stars(modsfixed.data[0].difficultyrating,compareinfo.data.scores[i].beatmap.mode)} (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: compareinfo.data.scores[i].mods}).mod_text}\` • ${score(compareinfo.data.scores[i].score)}\n${ranks(compareinfo.data.scores[i].grade)} *${compareinfo.data.scores[i].beatmap.version}* • **${Number((compareinfo.data.scores[i].pp).toFixed(2))}pp** • x${compareinfo.data.scores[i].max_combo}\n${Number((compareinfo.data.scores[i].acc).toFixed(2))}% \`[ ${compareinfo.data.scores[i].ngeki} • ${compareinfo.data.scores[i].n300} • ${compareinfo.data.scores[i].nkatu} • ${compareinfo.data.scores[i].n100} • ${compareinfo.data.scores[i].n50} • ${compareinfo.data.scores[i].nmiss} ]\`\n\`${modsfixed.data[0].diff_size}K\` • ${timeago(compareinfo.data.scores[i].play_time)}\n\n`
							} else {
								embeddesc = embeddesc+`${i+1}. ${stars(modsfixed.data[0].difficultyrating,compareinfo.data.scores[i].beatmap.mode)} (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: compareinfo.data.scores[i].mods}).mod_text}\` • ${score(compareinfo.data.scores[i].score)}\n${ranks(compareinfo.data.scores[i].grade)} *${compareinfo.data.scores[i].beatmap.version}* • **${Number((compareinfo.data.scores[i].pp).toFixed(2))}pp** • x${compareinfo.data.scores[i].max_combo}/${compareinfo.data.scores[i].beatmap.max_combo}\n${Number((compareinfo.data.scores[i].acc).toFixed(2))}% \`[ ${compareinfo.data.scores[i].n300} • ${compareinfo.data.scores[i].n100} • ${compareinfo.data.scores[i].n50} • ${compareinfo.data.scores[i].nmiss} ]\`\n${timeago(compareinfo.data.scores[i].play_time)}\n\n`
							}
							
							if(compareinfo.data.scores[i].beatmap.mode == "1"){ modetext = "Taiko" }
							if(compareinfo.data.scores[i].beatmap.mode == "2"){ modetext = "Catch" }
							if(compareinfo.data.scores[i].beatmap.mode == "3"){ modetext = "Mania" }
						}
						const embed = new MessageEmbed()
							.setColor('#B65FCF')
							.setAuthor({ name: `Top osu!${modetext} plays for ${playerinfo.data.player.info.name} on ${compareinfo.data.scores[0].beatmap.title} - ${compareinfo.data.scores[0].beatmap.version}`, iconURL: `https://a.mixdev.online/${playerinfo.data.player.info.id}`, url: `https://osu.ppy.sh/b/${compareinfo.data.scores[0].beatmap.id}`})
							.setDescription(embeddesc)
							.setThumbnail(`https://assets.ppy.sh/beatmaps/${compareinfo.data.scores[0].beatmap.set_id}/covers/list@2x.jpg`);
						
						msg.delete();
						message.channel.send({embeds: [embed]});
					}).catch(function (error) {
						msg.edit(`**${user}** didn't play this map! (vanilla)`);
					});
				});
			}).catch(function (error) {
				msg.edit(`User **${user}** doesn't exist`);
			});
        })
    }
}