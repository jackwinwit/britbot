const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'user-info',
    description: 'Outputs your user info.',
    cooldown: 5,
    execute(message, args) {
        if (!message.mentions.users.size) {
			return message.channel.send(`**Username:** ${message.author}\n**User ID:** ${message.author.id}`)
		} 
        const taggedUser = message.mentions.users.first();
        
        const userinfoEmbed = new Discord.MessageEmbed()
            .setColor('#d00c27')
            .setTitle('')

        message.channel.send(`**Username:** ${taggedUser}\n**User ID:** ${taggedUser.id}`);
    },
};