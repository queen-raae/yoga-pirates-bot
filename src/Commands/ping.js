const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bots latency!"),
  execute: async (interaction, client) => {
    await interaction.reply("Pong!");
    await wait(2000);
    await interaction.editReply("Pong again!");
    // interaction.reply({ content: `Pong \`${client.ws.ping}ms\` 🏓` });
  },
};
