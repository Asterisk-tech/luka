const {exec, spawn} = require('node:child_process');
const {Events} = require('discord.js');

module.exports = function (client, config) {
client.on(Events.MessageCreate, message => {
	if (message.content === `${config.commandPrefix}reload` && message.author.id == config.userId) {
	// Do a Git pull to check for updates
		const gitPull = spawn('git', ['pull']);

		gitPull.stdout.on('data', data => {
		// If there are any updates, kill the old process and restart it
			if (data.toString().includes('Fast-forward')) {
				const killProcess = spawn('kill', [process.pid]);
				killProcess.on('close', () => {
					exec('node ./index.js', (error, stdout, stderr) => {
						if (error) {
							console.error(`Error: ${error}`);
						}
					});
					message.reply('Updates were installed, restarting...');
				});
			} else {
				message.reply('Already up to date.');
			}
		});
	}
});
};