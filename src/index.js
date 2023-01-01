// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from "discord.js";

import { DISCORD_CLIENT_TOKEN } from "./config.js";

import yogaLogger from "./services/yoga-logger.js";

// Create a new discord client instance
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
discordClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

yogaLogger(discordClient);

// Log in to Discord with your client's token
discordClient.login(DISCORD_CLIENT_TOKEN);
