const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const requiredDirs = ['commands', 'modules', 'config'];
for (const dir of requiredDirs) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log(`[${new Date().toISOString()}] Directory "${dir}" created.`);
    }
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

function loadCommands() {
    client.commands.clear();
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            if (!command.data || typeof command.execute !== 'function') {
                console.error(`[${new Date().toISOString()}] Command in "${file}" is missing "data" or "execute".`);
                continue;
            }
            client.commands.set(command.data.name, command);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error loading "${file}":`, error);
        }
    }
    console.log(`[${new Date().toISOString()}] ${client.commands.size} commands loaded.`);
}

loadCommands();

function syncCommands() {
    const commandsJson = [...client.commands.values()].map(c => {
        try {
            return c.data.toJSON();
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error converting "${c.data.name}" to JSON:`, error);
            return null;
        }
    }).filter(cmd => cmd !== null);

    client.application.commands.set(commandsJson)
        .then(() => console.log(`[${new Date().toISOString()}] Commands successfully synced.`))
        .catch(error => console.error(`[${new Date().toISOString()}] Command sync failed:`, error));
}

fs.watch(commandsPath, (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
        console.log(`[${new Date().toISOString()}] ${eventType} detected in "${filename}". Reloading commands...`);
        loadCommands();
        if (client.application) {
            syncCommands();
        } else {
            console.log(`[${new Date().toISOString()}] Client application not ready, syncing on "ready" event.`);
        }
    }
});

const modulesPath = path.join(__dirname, 'modules');
function loadModules() {
    const moduleFiles = fs.readdirSync(modulesPath).filter(f => f.endsWith('.js'));
    for (const file of moduleFiles) {
        const filePath = path.join(modulesPath, file);
        try {
            delete require.cache[require.resolve(filePath)];
            require(filePath)(client, axios);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error loading module "${file}":`, error);
        }
    }
    console.log(`[${new Date().toISOString()}] ${moduleFiles.length} modules loaded.`);
}

loadModules();

fs.watch(modulesPath, (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
        console.log(`[${new Date().toISOString()}] ${eventType} detected in module "${filename}". Reloading modules...`);
        loadModules();
    }
});

const configDir = path.join(__dirname, 'config');
client.config = {};
function loadConfigs() {
    const configFiles = fs.readdirSync(configDir).filter(f => f.endsWith('.json'));
    for (const file of configFiles) {
        const filePath = path.join(configDir, file);
        try {
            const configData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            client.config[file] = configData;
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error loading config "${file}":`, error);
        }
    }
    console.log(`[${new Date().toISOString()}] ${Object.keys(client.config).length} config files loaded.`);
}

loadConfigs();

fs.watch(configDir, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
        console.log(`[${new Date().toISOString()}] ${eventType} detected in config file "${filename}". Reloading configs...`);
        loadConfigs();
    }
});

client.once('ready', async () => {
    const now = new Date();
    try {
        await client.application.commands.set([...client.commands.values()].map(c => c.data.toJSON()));
        console.log(`[${now.toISOString()}] Logged in as ${client.user.tag}`);
        console.log(`[${now.toISOString()}] ${client.commands.size} commands loaded`);
        console.log(`[${now.toISOString()}] Modules loaded`);
        console.log(`[${now.toISOString()}] ${Object.keys(client.config).length} config files loaded`);
        console.log(`[${now.toISOString()}] Guild count: ${client.guilds.cache.size}`);
        console.log(`[${now.toISOString()}] User count: ${client.users.cache.size}`);
    } catch (error) {
        console.error(`[${now.toISOString()}] Command sync failed:`, error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`[${new Date().toISOString()}] Command "${interaction.commandName}" not found.`);
        return;
    }
    try {
        await command.execute(interaction, axios);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error executing "${interaction.commandName}":`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
