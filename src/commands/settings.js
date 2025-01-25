import { SlashCommandBuilder } from "discord.js";
import Database from "better-sqlite3";
const db = new Database(process.env.DATABASE_PATH);

const createOrUpdateStatement = db.prepare(`
  INSERT OR REPLACE INTO yogis (
    id,
    timezone
  ) VALUES (?, ?)
`);

export default {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Lists all your yoga sessions")
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription(
          "Your local timezone, e.g. Europe/Stockholm or America/New_York"
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const discordUserId = interaction.user.id;
    const timezone = interaction.options.getString("timezone");

    if (Intl.supportedValuesOf("timeZone").includes(timezone)) {
      const result = createOrUpdateStatement.run(discordUserId, timezone);

      console.log(">>>>>>> Updated settings for", record.lastInsertRowid);

      await interaction.reply({
        content: "Timezone was stored",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Timezone not supported",
        ephemeral: true,
      });
    }
  },
};
