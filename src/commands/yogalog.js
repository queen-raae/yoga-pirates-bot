import { SlashCommandBuilder } from "discord.js";
import { getXataClient } from "./../xata.js";

export default {
  data: new SlashCommandBuilder()
    .setName('yogalog')
    .setDescription('Lists all your yoga sessions'),
  async execute(interaction, xata = getXataClient()) {
    const discordUserId = interaction.user.id;

    const results = await xata.db.session
      .filter({discordUserId: discordUserId})
      .getAll();

    let output = `Days of yoga: ${results.length}\n`
    output += results.map(row => `- ${row.sessionDateString}: ${row.note}`).join("\n")

    await interaction.reply(output);
  },
};
