const { MessageEmbed } = require("discord.js")
const api = require('../../Constants/api.js')
const botConfig = require('../../../Config.js')

module.exports = {
    name: "info",
    run: async(client, message, args, container) => {
        message.channel.send("Searching info...").then(async msg => {

            let playercount = await api().get('get_player_count', {
                params: {
                }
                });
                
            let lastplayer = await api().get('get_player_info', {
                params: {
                    id: playercount.data.counts.total+1,
                    scope: 'all'
                }
                });

            const embed = new MessageEmbed()
                .setColor('#B65FCF')
                .setTitle(`General information of Aogiri Server`)
                .setURL(`https://${botConfig.domain.replace('https://','')}/`)
                .setDescription(`**Total players:** ${playercount.data.counts.total}\n**Online players:** ${playercount.data.counts.online}\n**Last registered**: ${lastplayer.data.player.info.name} from :flag_${lastplayer.data.player.info.country}:\n\n**Website:** [${(botConfig.domain.replace('https://','')).replace('/','')}](${botConfig.domain})\n**API (for dev purposes):** [${botConfig.apidomain}](${botConfig.apidomain})\n\nIf you want to know how API works, please check this page: https://github.com/JKBGL/gulag-api-docs\n\nIf you want to know how to connect to the server, check this tutorial: https://imgur.com/a/iA6OxcS`)
                .setThumbnail(`https://${botConfig.logourl.replace('https://','')}`)
            
            msg.delete();
            message.channel.send({embeds: [embed]});
        })
    }
}
