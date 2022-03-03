const api = require('../../Constants/api.js');
const mysql = require("../../Constants/mysql.js");

module.exports = {
    name: "osuset",
    run: async(client, message, args, container) => {
        
        if(!args[0]) return message.channel.send(`:negative_squared_cross_mark: ${message.author.username}, you need to write the username!`);
		
        var user = '';
        user = args.join(" ");
        var find = ' ';
		var re = new RegExp(find, 'g');	

        api().get('get_player_info', {
            params: {
            name: user.replace(re, '_'),
            scope: 'all'
            }
        })
        .then(function (playerinfo) {
            mysql().query("SELECT COUNT(1) AS exist FROM osu_users WHERE discord_id = '"+message.author.id+"'", function (err, result) {
                if (err) throw err;
                
                if(result[0].exist == 1){
                    mysql().query("UPDATE osu_users SET osu_user = '"+user+"' WHERE discord_id = "+message.author.id+"", function (err) {
                    
                    if (err) throw err;
                        
                    message.channel.send(`:white_check_mark: ${message.author.username}, your username now is \`${user}\``);
                    
                    });
                    
                } else {
                    
                    mysql().query("INSERT INTO osu_users (discord_id,osu_user) VALUES ('"+message.author.id+"','"+user+"')", function (err) {
                    if (err) throw err;
                    
        
                    message.channel.send(`:white_check_mark: ${message.author.username}, you re' doing great! Your username is \`${user}\``);
                    
                    });
                }
            });
        }).catch(function (error) {
            msg.edit(`Sorry, **${user}** doesn't exist! Register first!`);
        });
    }
}