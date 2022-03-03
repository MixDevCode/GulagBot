const { MessageEmbed } = require("discord.js")
const botConfig = require('../../../Config.js')
const api = require('../../Constants/api.js')
const osu = require('../../Constants/osuapi.js')
const modreplace = require('../../Constants/modreplace.js')
const ranks = require('../../Constants/ranks.js')
const modEnum = require('../../Functions/mods_enum.js')
const timeago = require('../../Functions/time_ago.js')
const bid = require('../../Functions/beatmapid.js')
const score = require('../../Functions/score_format.js')
const stars = require('../../Functions/stars.js')

module.exports = {
    name: "mapleaderboard",
    aliases: ['ml'],
    run: async(client, message, args, container) => {
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
        message.channel.send("Querying map leaderboard...").then(async msg => {
			let beatmaplink = linkarray.toString();
			let mapinfo = await api().get('get_map_info', {
				params: {
					id: bid(beatmaplink).id_beatmap
				}
			});

			api().get('get_map_scores', {
				params: {
					id: mapinfo.data.map.id,
					scope: "best",
					limit: 10
				}
			})
			.then(async function (compareinfo) {
					let embeddesc = "";
					for (let i = 0; i < compareinfo.data.scores.length; i++) {
						let modsfixed = await osu().get('get_beatmaps', {
							params: {
								k: botConfig.apikey,
								b: mapinfo.data.map.id,
								mods: modreplace(compareinfo.data.scores[i].mods)
							}
						});
						
						if(compareinfo.data.scores[i].mode == "3"){
							embeddesc = embeddesc+`${i+1}. ${stars(modsfixed.data[0].difficultyrating,compareinfo.data.scores[i].mode)} **[${compareinfo.data.scores[i].player_name}](${botConfig.domain}/u/${compareinfo.data.scores[i].userid})** (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: compareinfo.data.scores[i].mods}).mod_text}\` • ${score(compareinfo.data.scores[i].score)}\n${ranks(compareinfo.data.scores[i].grade)} *${mapinfo.data.map.version}* • **${Number((compareinfo.data.scores[i].pp).toFixed(2))}pp** • x${compareinfo.data.scores[i].max_combo}\n${Number((compareinfo.data.scores[i].acc).toFixed(2))}% \`[ ${compareinfo.data.scores[i].ngeki} • ${compareinfo.data.scores[i].n300} • ${compareinfo.data.scores[i].nkatu} • ${compareinfo.data.scores[i].n100} • ${compareinfo.data.scores[i].n50} • ${compareinfo.data.scores[i].nmiss} ]\`\n\`${modsfixed.data[0].diff_size}K\` • ${timeago(compareinfo.data.scores[i].play_time)}\n\n`
						} else {
							console.log(compareinfo.data.scores[i].play_time)
							embeddesc = embeddesc+`${i+1}. ${stars(modsfixed.data[0].difficultyrating,compareinfo.data.scores[i].mode)} **[${compareinfo.data.scores[i].player_name}](${botConfig.domain}/u/${compareinfo.data.scores[i].userid})** (${Number((parseFloat(modsfixed.data[0].difficultyrating)).toFixed(2))}★) \`${modEnum({mod: compareinfo.data.scores[i].mods}).mod_text}\` • ${score(compareinfo.data.scores[i].score)}\n${ranks(compareinfo.data.scores[i].grade)} *${mapinfo.data.map.version}* • **${Number((compareinfo.data.scores[i].pp).toFixed(2))}pp** • x${compareinfo.data.scores[i].max_combo}/${mapinfo.data.map.max_combo}\n${Number((compareinfo.data.scores[i].acc).toFixed(2))}% \`[ ${compareinfo.data.scores[i].n300} • ${compareinfo.data.scores[i].n100} • ${compareinfo.data.scores[i].n50} • ${compareinfo.data.scores[i].nmiss} ]\`\n${timeago(compareinfo.data.scores[i].play_time)}\n\n`
						}
					}
					const embed = new MessageEmbed()
						.setColor('#B65FCF')
						.setAuthor({ name: `Top 10 Global Plays on ${mapinfo.data.map.title} [${mapinfo.data.map.version}]`, url: `https://osu.ppy.sh/b/${mapinfo.data.map.id}`})
						.setDescription(embeddesc)
						.setThumbnail(`https://assets.ppy.sh/beatmaps/${mapinfo.data.map.set_id}/covers/list@2x.jpg`);
					
					msg.delete();
					message.channel.send({embeds: [embed]});
			}).catch(function (error) {
				msg.edit(`The map don't have any score!`);
				console.log(error)
			});
        })
    }
}