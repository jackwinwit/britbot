const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'commission',
	description: 'Create a commission request.',
	aliases: ['commission', 'comm', 'hire'],
	usage: '[command name]',
	cooldown: 5,
	execute(message) {
		const data = [];
		const { commands } = message.client;

		const startCommEmbed = new Discord.MessageEmbed()
			.setColor('#d00c27')
			.setTimestamp() 
  			.setTitle('__**COMMISSION REQUEST**__')
			.setDescription(``);
				  
		data.push(startCommEmbed)

		return message.author.send(data, { split: true })
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('Commission request started in your dms!');
			})
			.catch(error => {
				console.error(`Could not send commission request DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you!');
			});
	},
};
