const { GuildMember } = require("discord.js");

module.exports = {
	name: 'Ban',
	description: 'Ban a member from the server.',
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to ban them!');
		}

		if (message.author.id === '269926271633326082') {
			const taggedUser = message.mentions.users.first();
            message.mentions.members.first().ban()
	    	const banEmbed = new Discord.MessageEmbed()
				.setColor('#d00c27')
				.setDescription(`**${taggedUser.username} has been banned!**`)
				.setTimestamp()
				.setFooter(`Moderator: ${message.author.username}`)

		message.channel.send(banEmbed)
		} else {
            return message.reply(`You don\'t have permissions to run that command ${message.author}!`);
        }
	},
};