
# Bytepulse

Bytepulse is a lightweight, modular bot framework designed for flexibility and performance. Built with Node.js, it provides a clean structure for creating and deploying slash commands and custom modules. This project is perfect for open source enthusiasts looking for a robust and easy-to-extend bot solution.

## Features

- **Modular Structure:** Easily add, remove, or modify commands and modules.
- **Performance Optimized:** Minimal overhead with a focus on speed and efficiency.
- **Automatic Directory Creation:** Automatically creates the necessary folders (`commands`, `modules`, `config`) on startup.
- **Detailed Startup Logging:** Displays comprehensive information when the bot starts, including command and module counts, server, and user statistics.
- **Axios Integration:** Uses Axios for HTTP requests, ensuring a powerful alternative to native fetch.

## Required Intents

To function properly, Bytepulse requires the following [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents):

- `Presence Intent` – Allows the bot to receive basic information about servers it is in.
- `Server Members Intent` – Enables the bot to access member data, useful for interactions and moderation logic.

When setting up your bot in the [Discord Developer Portal](https://discord.com/developers/applications), ensure these intents are enabled under the “Bot” section.

```js
intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
]
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16.9.0 or newer)
- A Discord bot token
- Git (optional, for cloning the repository)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/nebula-nexus.git
   cd nebula-nexus
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add your token:**

   ```env
   TOKEN=your-token-here
   ```

## Folder Structure

```
nebula-nexus/
├── commands/
│   └── ping.js        # Example slash command
├── modules/
│   └── ready-log.js   # Example module for logging startup details
├── config/            # Configuration files can be added here
├── bot.js             # Main bot file
├── .env               # Environment variables
├── package.json
└── README.md
```

## Usage

1. **Run the bot:**

   ```bash
   node bot.js
   ```

2. The bot will automatically create the required directories if they do not exist and synchronize all slash commands with the API.

3. Interact with the bot using the `/ping` command to see a basic response.

## Adding New Commands

1. Create a new file in the `commands` directory (e.g., `hello.js`).
2. Export an object with `data` and `execute` properties using the [SlashCommandBuilder](https://discord.js.org/#/docs/main/stable/class/SlashCommandBuilder) for the command structure.
3. The bot will automatically load and register the command on startup.

## Adding New Modules

1. Create a new file in the `modules` directory (e.g., `logger.js`).
2. Export a function that receives the client (and Axios, if needed) as parameters.
3. The module will be executed during startup, allowing you to extend the bot's functionality easily.

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue on GitHub.

Enjoy building with Bytepulse!