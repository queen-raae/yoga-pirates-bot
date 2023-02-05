// Require the necessary discord.js classes
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_TOKEN } from "./config.js";

import yogaLogger from "./services/yoga-logger.js";
import yogalog from "./commands/yogalog.js";

// Create a new discord client instance
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

discordClient.commands = new Collection();
discordClient.commands.set(yogalog.data.name, yogalog);

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
discordClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

yogaLogger(discordClient);

// Log in to Discord with your client's token
discordClient.login(DISCORD_CLIENT_TOKEN);
