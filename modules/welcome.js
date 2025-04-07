// modules/welcome.js
const fs = require('fs');
const path = require('path');

function loadWelcomeConfig() {
    const configPath = path.join(__dirname, '../config/welcome.json');
    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            "welcomeChannelId": "YOUR_CHANNEL_ID",
            "welcomeMessage": "Welcome to the server, {username}!"
        };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
        return defaultConfig;
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

module.exports = (client) => {
    const config = loadWelcomeConfig();
    client.on('guildMemberAdd', async member => {
        if (!config.welcomeChannelId || config.welcomeChannelId === "YOUR_CHANNEL_ID") return;
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (!channel) return;
        const message = config.welcomeMessage.replace('{username}', member.user.username);
        try {
            await channel.send({ content: message });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    });
};
