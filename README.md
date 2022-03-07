# Simple Gulag Bridge Bot for Discord
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
![Maintainer](https://img.shields.io/badge/maintainer-Mix-blue)

## Prerequisites
 * Node JS >= 12.0.0
 * NPM >= 6.9.0
 * Git
 * MYSQL
 
## Setup
1. Clone this repository: `git clone https://github.com/MixDevCode/GulagBot.git`
2. Install dependencies with `npm i`
3. Edit `Config.js`, replacing the placeholder values with your desired command prefix, bot token (If you 
   don't have one yet, see the note below on how to generate one), domain name, osu api key, etc.
4. Create a new database with the name you chose in the config file.
5. Import `gulagbot.sql` in the database.
6. Start the bot with `node .`
7. Add the bot to the server of your choice by filling out the details in this 
   [handy application](https://discordapi.com/permissions.html#137439333440) and clicking the generated link.

That's it! You can now try out the default commands like `!bot info`, or create your own and restart the bot to use them.

>**Note:**
> If you don't already have a Discord bot application setup you can create one by going to the 
> [Discord Developer Portal](https://discord.com/developers/applications/me), then create a new application, give it a 
> name, go to the "Bot" tab, then click on "Add Bot", and you're good to go!


## Usage
After adding the bot to a server, call its command via `!bot` where "!bot" is the prefix you defined in config.js

## General Commands
> Commands with * you can write an username or ping any discord user e.g. !bot recent Mix

* `!bot osuset` to set your username e.g. !bot osuset Mix
* `!bot info` to see current server info like total users, online users, domain, etc.
* `!bot osuavatar` to see your current avatar.
* `!bot mapleaderboard (or ml)` to see the first 10 scores of a map.

### Standard Commands
* `!bot osu*` to see your std information.
* `!bot leaderboard (or lb)` to see the first 10 users on std!leaderboard sorted by pp.
* `!bot recent (or rs)*` to show your most recent play.
* `!bot osutop (or top)*` to see your first 5 plays sorted by pp.

### Mania Commands
* `!bot mania*` to see your mania information.
* `!bot manialeaderboard (or manialb)` to see the first 10 users on std!leaderboard sorted by pp.
* `!bot maniarecent (or mrs)*` to show your most recent play.
* `!bot maniatop*` to see your first 5 mania plays sorted by pp.

### Taiko Commands
* `!bot taiko*` to see your taiko information.
* `!bot taikoleaderboard (or taikolb)` to see the first 10 users on taiko!leaderboard sorted by pp.
* `!bot taikorecent (or trs)*` to show your most recent taiko play.
* `!bot taikotop*` to see your first 5 taiko plays sorted by pp.

### Catch Commands
* `!bot ctb*` to see your catch information.
* `!bot catchleaderboard (or ctblb)` to see the first 10 users on catch!leaderboard sorted by pp.
* `!bot catchrecent (or ctbrs)*` to show your most recent catch play.
* `!bot taikotop*` to see your first 5 catch plays sorted by pp.

### Relax Commands
* `!bot relax*` to see your relax information.
* `!bot relaxleaderboard (or relaxlb)` to see the first 10 users on relax!leaderboard sorted by pp.
* `!bot relaxrecent (or rxr)*` to show your most recent relax play.
* `!bot relaxtop (or rxtop)*` to see your first 5 relax plays sorted by pp.

### AutoPilot Commands
* `!bot ap*` to see your autopilot information.
* `!bot apleaderboard (or aplb)` to see the first 10 users on ap!leaderboard sorted by pp.
* `!bot aprecent (or aprs)*` to show your most recent autopilot play.
* `!bot aptop*` to see your first 5 autopilot plays sorted by pp.

## Running the bot permanently
It's recommended that you use a process monitor like [PM2](https://pm2.keymetrics.io/) to run the bot instead of 
just `node`, that way it can be restarted on crashes and monitored.

If you don't want to keep your computer on 24/7 to host the bot, I recommend a $5/month droplet from 
[DigitalOcean](https://m.do.co/c/b96f8bd70573).


### Notes
I created this bot for my server more than anything, if you have any doubt don't hesitate to talk to me at discord: Mix#8164.

Thanks Tienei for help me with some shits like ModEnum, Functions and more. Love u. <3

<img src="https://cdn.discordapp.com/attachments/879092238964101150/948843509685841950/unknown.png"></img>
