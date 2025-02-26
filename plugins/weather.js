const weather = require('weather-js');
const {Events} = require('discord.js');

module.exports = function (client, config) {
	client.on(Events.MessageCreate, message => {
		const match = message.content.match(new RegExp(`^${config.commandPrefix}weather (\\d+)`));
		if (match) {
			// Use the library to search for the weather data by zip code
			weather.find({search: match[1], degreeType: 'F'}, (error, result) => {
				if (error) {
					console.log(error);
				}

				// Check if the search returned any results
				if (result.length > 0) {
					// Get the first result from the search (should be the only result)
					const weatherData = result[0].current;
					// Reply with the current temperature, humidity, windspeed, and weather condition in a list format
					message.reply(`Here is the current weather information:
      - Temperature: ${weatherData.temperature} degrees
      - Humidity: ${weatherData.humidity}%
      - Windspeed: ${weatherData.windspeed}
      - Weather: ${weatherData.skytext}`);
				} else {
					// If no results were returned, reply with an error message
					message.reply('Invalid zip code. Please enter a valid 5-digit US zip code.');
				}
			});
		}
	});
};
