const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const contents = fs.readFileSync('credentials.json', 'utf8');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('guildMemberAdd', async member => {
  try {
    const key = await member.send('Please enter your key from keyauth.cc to join the server:');

    // Load the app credentials from a JSON file
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));


    const clientId = credentials.clientId;
    const clientSecret = credentials.clientSecret;
    const accessToken = credentials.accessToken;

    // Set the authorization header for all subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // Make a request to the keyauth.cc API to check the key entered by the user
    const checkKeyResponse = await axios.post('https://keyauth.cc/api/check-key', { key });
    const valid = checkKeyResponse.data.valid;

    if (valid) {
      member.send('Thank you! You have been granted access to the server.');
    } else {
      member.kick('Invalid key');
    }
  } catch (error) {
    console.error(error);
  }
});

client.login('OTc5Nzc4OTg0OTQwMjk4Mjkw.GqsRpW.oBXpFDxEuCZuVixgEvkZrN2BLgbkU94fuYfX48');