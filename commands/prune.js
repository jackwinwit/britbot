module.exports = {
    name: 'prune',
    description: 'Deletes a large amount of messages.',
    cooldown: 5,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        }

        else if (amount <= 1 || amount > 100) {
            return message.reply('you need to input a number between 1 and 99.');
        }

    message.channel.bulkDelete(amount, true).catch(err => { // true allows messages older than 2 weeks to be deleted which would normally result in an error
        console.error(err);
        message.channel.send('There was an error trying to prune messages in this channel!'); // if there are messages within 2 weeks and after 2 weeks it will only delete the ones before 2 weeks. This notifies the user of this error
    });
    },
};