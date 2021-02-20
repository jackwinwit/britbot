const { GuildMember, DiscordAPIError } = require("discord.js");
const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		if (!message.author.id === '269926271633326082') {
			return message.reply('You don\'t have permissions to run that command ${message.author}!')
		}

		const taggedUser = message.mentions.users.first();
        message.mentions.members.first().kick()
		
		const kickEmbed = new Discord.MessageEmbed()
			.setColor('#d00c27')
			.setDescription(`**${taggedUser.username} has been kicked**`)
			.setTimestamp()
			.setFooter(`Moderator: ${message.author.username}`)

		message.channel.send(kickEmbed)		
	},
};