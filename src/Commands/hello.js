const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say Hello To me!"),
  execute: async (interaction, client) => {
    interaction.reply({ content: "Choo choo! 🚅" });
  },
};
