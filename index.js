const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!')
    client.user.setActivity(',help', { type: 'LISTENING' });
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.channel.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	client.on('messageDelete', async message => {
		if (!message.guild) return; // Ignores direct messages
		const fetchedLogs = await message.guild.fetchAuditLogs({
			limit: 1,
			type: 'MESSAGE_DELETE',
		});

		const deletionLog = fetchedLogs.entries.first();

		if (!deletionLog)
			return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`); // Presence Check (Validation)

		const { executor, target } = deletionLog;

		if (target.id === message.author.id) {
			console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
		} else {
			console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
		}
	});

	client.on('guildMemberRemove', async member => {
		if (!message.guild) return;
		const fetchedLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: 'MEMBER_KICK',
		});

		const kickLog = fetchedLogs.entries.first();

		if (!kickLog) return console.log(`${member.user.tag} left the guild, likely of their own will.`) // Presence Check (Validation)

		const { executor, target } = kickLog;

		if (target.id === member.id) {
			console.log(`${member.user.tag} left the guild, kicked by ${executor.tag}.`);
		} else {
			console.log(`${member.user.tag} left the guild, audit log fetch was inconculsive.`)
		}
	});

	client.on('guildBanAdd', async (guild, user) => {
		if (!message.guild) return;
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: 'MEMBER_BAN_ADD',
		});

		const banLog = fetchedLogs.entries.first();

		if (!banLog) return console.log(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

		const { executor, target } = banLog;

		if (target.id === user.id) {
			console.log(`${user.tag} got banned in ${guild.name}, by ${executor.tag}`);
		} else {
			console.log(`${user.tag} got banned in ${guild.name}, audit log fetch was inconclusive.`)
		};
	});

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply(error.message);
	}
})

client.login(token)