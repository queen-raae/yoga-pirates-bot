// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");

const { DISCORD_CLIENT_TOKEN } = require("./config");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// When there is a yoga log message, reply with
client.on(Events.MessageCreate, async (message) => {
  console.log({ message });
  // Get channel
  const channel = await client.channels.fetch(message.channelId);

  // Ignore bot messages
  if (message.author.bot) return;
  // Ignore if not in yoga channel
  if (channel.name.toLowerCase() !== "yoga") return;
  // Ignore if message does not start with ✅
  if (!message.content.trim().startsWith("✅")) return;

  message.react("🏴‍☠️");
});

// Log in to Discord with your client's token
client.login(DISCORD_CLIENT_TOKEN);
