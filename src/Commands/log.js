const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log")
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("A little about the practice")
    )
    .addStringOption((option) =>
      option
        .setName("when")
        .setDescription("The gif category")
        .addChoices(
          { name: "Today", value: "today" },
          { name: "Yesterday", value: "yesterday" }
        )
    )
    .setDescription("Log yoga session"),
  async execute(interaction) {
    const description = interaction.options.getString("description") ?? "";
    const when = interaction.options.getString("when") ?? "today";

    await interaction.reply(
      `🎉 You did yoga ${when} ${description && ": " + description}`
    );
  },
};
