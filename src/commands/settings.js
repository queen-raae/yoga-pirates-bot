import { SlashCommandBuilder } from "discord.js";
import { getXataClient } from "../xata.js";

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

  async execute(interaction, xata = getXataClient()) {
    const discordUserId = interaction.user.id;
    const timezone = interaction.options.getString("timezone");

    if (Intl.supportedValuesOf("timeZone").includes(timezone)) {
      const record = await xata.db.yogis.createOrUpdate({
        id: discordUserId,
        timezone: timezone,
      });

      console.log(">>>>>>> Updated settings for", record.id);

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
