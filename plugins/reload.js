const {exec, spawn} = require('node:child_process');
const {Events} = require('discord.js');

module.exports = function (client, config) {
client.on(Events.MessageCreate, message => {
	if (message.content === `${config.commandPrefix}reload` && message.author.id == config.userId) {
	// Do a Git pull to check for updates
		const gitPull = spawnSync('git', ['pull']);

		// If the exit code is 0, updates were installed
		if (gitPull.status === 0) {
			const killProcess = spawn('kill', [process.pid]);
			killProcess.on('close', () => {
				const nodeProcess = fork('./index.js');
				nodeProcess.on('close', () => {
					console.log('Node process restarted');
					message.reply('Updates were installed, restarting...');
				});
			});
		} else {
			message.reply('Already up to date, you idiot!');
		}
	}
});

};