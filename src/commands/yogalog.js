import { SlashCommandBuilder } from "discord.js";
import Database from "better-sqlite3";

const db = new Database(process.env.DATABASE_PATH);

const sessionsStatement = db.prepare(`
  SELECT *
  FROM session
  WHERE 
    discordUserId = ? AND
    exercise = 'yoga'
  ORDER BY sessionTimestamp ASC
`);

const sessionsStatementPeriod = db.prepare(`
  SELECT *
  FROM session
  WHERE 
    discordUserId = ? AND 
    sessionTimestamp > ? AND
    exercise = 'yoga'
  ORDER BY sessionTimestamp ASC
`);

export default {
  data: new SlashCommandBuilder()
    .setName("yogalog")
    .setDescription("Lists all your yoga sessions")
    .addStringOption((option) =>
      option
        .setName("period")
        .setDescription("Which period to list")
        .setRequired(false)
        .addChoices(
          {
            name: "Week",
            value: "week",
          },
          {
            name: "Month",
            value: "month",
          },
          {
            name: "Year",
            value: "year",
          }
        )
    ),

  async execute(interaction) {
    const discordUserId = interaction.user.id;
    const period = interaction.options.getString("period");

    let results = null;

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
      results = sessionsStatementPeriod.all(discordUserId, start.toISOString());
    } else {
      results = sessionsStatement.all(discordUserId);
    }

    let header = `Days of yoga: ${results.length}\n`;
    if (period) {
      header += `Period: ${period}\n`;
    }

    const rows = results.map((row) => {
      const result = `- ${row.sessionDateString}: ${row.note}`;
      if (result.length > 2000) {
        return result.slice(0, 2000);
      }

      return result;
    });

    const totalLength = rows.reduce((acc, row) => acc + row.length, 0);
    if (totalLength + header.length > 2000) {
      const reply = `${header}Too many rows to display, will send as DM.`;
      await interaction.reply({ content: reply, ephemeral: true });
      let message = header;
      for (const row of rows) {
        if (message.length + row.length > 2000) {
          await interaction.user.send(message);
          message = "";
        }
        message += row + "\n";
      }

      await interaction.user.send(message);
    } else {
      await interaction.reply({
        content: `${header}${rows.join("\n")}`,
        ephemeral: true,
      });
    }
  },
};
