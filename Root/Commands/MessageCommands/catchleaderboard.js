const { MessageEmbed } = require("discord.js")
const api = require('../../Constants/api.js')
const botConfig = require('../../../Config.js')

module.exports = {
    name: "catchleaderboard",
    aliases: ['clb','ctblb'],
    run: async(client, message, args, container) => {
        message.channel.send("Searching users...").then(async msg => {

            let leaderboardinfo = await api().get('get_leaderboard', {
                params: {
                    limit: 10,
                    mode: 2
                    }
                });
            
            var lbname = "";
			var lbpp = "";
            var lbposition = "";

            for (let i = 0; i < leaderboardinfo.data.leaderboard.length; i++) {
                lbname = lbname+":flag_"+leaderboardinfo.data.leaderboard[i].country+": "+leaderboardinfo.data.leaderboard[i].name+"\n";
                lbpp = lbpp+leaderboardinfo.data.leaderboard[i].pp+"pp\n";
                lbposition = lbposition+"#"+(i+1)+"\n";
            };

            const embed = new MessageEmbed()
                .setColor('#B65FCF')
                .setTitle(`Top ${leaderboardinfo.data.leaderboard.length} osu!catch players in the server`)
                .setURL(`https://${botConfig.domain.replace('https://','')}/leaderboard/catch/pp/vn`)
                .addFields(
                    { name: '\u200B', value: `**${lbposition}**`, inline: true },
                    { name: 'Nick', value: `${lbname}`, inline: true },
                    { name: 'PP', value: `${lbpp}`, inline: true }
                )
                .setThumbnail(`https://${botConfig.logourl.replace('https://','')}`)
            
            msg.delete();
            message.channel.send({embeds: [embed]});
        })
    }
}