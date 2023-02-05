import { SlashCommandBuilder } from "discord.js";
import { getXataClient } from "./../xata.js";

export default {
  data: new SlashCommandBuilder()
    .setName('yogalog')
    .setDescription('Lists all your yoga sessions')
    .addStringOption(option =>
      option.setName('period')
        .setDescription("Which period to list")
        .setRequired(false)
        .addChoices(
          {
            name: "Week",
            value: "week"
          },
          {
            name: "Month",
            value: "month"
          },
          {
            name: "Year",
            value: "year"
          }
        )
    ),

  async execute(interaction, xata = getXataClient()) {
    const discordUserId = interaction.user.id;
    const period = interaction.options.getString('period');

    let results = await xata.db.session
      .filter({discordUserId: discordUserId})

    if (period) {
      const start = new Date();
      switch (period) {
        case "week":
          start.setDate(start.getDate() - 7);
          break;
        case "month":
          start.setMonth(start.getMonth() - 1);
          break;
        case "year":
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
      results = results.filter({sessionTimestamp: {$gt: start}});
    }

    results = await results.getAll();
    let output = `Days of yoga: ${results.length}\n`
    if (period) {
      output += `Period: ${period}\n`
    }
    output += results.map(row => `- ${row.sessionDateString}: ${row.note}`).join("\n")

    await interaction.reply(output);
  },
};
