const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function getConfig() {
    const configPath = path.join(__dirname, '../config/config.json');
    if (!fs.existsSync(configPath)) {
        const defaultConfig = { greeting: "Hello from config!", version: "1.0.0" };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
        return defaultConfig;
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong, bot latency, and config info.'),
    async execute(interaction) {
        const config = getConfig();
        await interaction.reply({ content: 'Pinging...' });
        const sent = await interaction.fetchReply();
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = interaction.client.ws.ping;
        await interaction.editReply(`🏓 Pong!
Client latency: ${latency}ms
API latency: ${apiLatency}ms
Config Greeting: ${config.greeting}`);
    }
};
