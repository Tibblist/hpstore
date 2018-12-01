const Discord = require('discord.js');
const client = new Discord.Client();
const INFO = require('./config');

var exports = module.exports = {};

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }
});

exports.sendBuilderMessage = function(message) {
    var guild = client.guilds.find()
}
  
client.login(INFO.BOT_TOKEN);