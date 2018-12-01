const Discord = require('discord.js');
const client = new Discord.Client();
const INFO = require('./config');
const order_ctrl = require('./controllers/order_ctrl');

var exports = module.exports = {};

const numberWithCommas = (x) => {
    if (x === null) {
        return null;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    } else if (message.content[0] === '$') {
        commandParser(message);
    }
});

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (channel) {
        // Send the message, mentioning the member
        channel.send(`${member} has joined the server.`);
    }
});

client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member} AKA ` + member.displayName + " has left the server.");

});

async function commandParser(message) {
    var parsedMsg = message.content.substring(1, message.length).toLowerCase()
    if (parsedMsg.includes("orders")) {
        var orders = await order_ctrl.getAllOrders();
        if (parsedMsg.includes("unclaimed")) {
            var count = 0;
            var output = "";

            orders.forEach(order => {
                if (order.builder === undefined) {
                    count++;
                    output += "ID: " + order.transID + "        Buyer: " + order.buyer.primaryCharacter.name + "        Total: " + numberWithCommas(order.price) + "\n"
                    if (count === 10) {
                        message.channel.send(output);
                        count = 0;
                        output = "";
                    }
                }
            });
            message.channel.send(output);
        } else {
            var query = parsedMsg.substring(7, parsedMsg.length).toLowerCase();
            var count = 0;
            var output = "";

            orders.forEach(order => {
                if (order.builder !== undefined && order.status !== 5 && order.builder.primaryCharacter.name.toLowerCase().includes(query)) {
                    count++;
                    output += "ID: " + order.transID + "        Buyer: " + order.buyer.primaryCharacter.name + "        Total: " + numberWithCommas(order.price) + "\n"
                    if (count === 10) {
                        message.channel.send(output);
                        count = 0;
                        output = "";
                    }
                }
            });
            message.channel.send(output);
        }
    }
}

async function sendBuilderMessage(message) {
    var guild = client.guilds.find(val => val.id === '510378397147332608');
    var channel = guild.channels.find(val => val.name === 'bot-testing');
    channel.send(message);
}

async function sendOrderLogMessage(message) {
    var guild = client.guilds.find(val => val.id === '510378397147332608');
    var channel = guild.channels.find(val => val.name === 'order-log');
    if (!INFO.DEBUG) channel.send(message);
}

exports.sendBuilderMessage = function(message) {
    sendBuilderMessage(message);
}

exports.postOrder = function(id, username, price) {
    sendOrderLogMessage("@here New order up TID: " + id + " by " + username + " total price is " + numberWithCommas(price) + " ISK")
}

client.login(INFO.BOT_TOKEN);