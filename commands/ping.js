module.exports = {
    name: 'ping',
    description: 'Simple ping pong command.',
    cooldown: 5,
    execute(message) {
        return message.reply('Pong!');
    }
};
