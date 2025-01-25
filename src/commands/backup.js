import { SlashCommandBuilder } from "discord.js";
import fs from "fs";

export default {
  data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Backup database"),

  async execute(interaction) {
    // copy database with date string and send it
    const date = new Date().toISOString().replace(/:/g, "-");
    const backupPath = `${process.env.DATABASE_PATH}.${date}`;
    fs.copyFileSync(process.env.DATABASE_PATH, backupPath);

    await interaction.user.send({
      body: "Backup of database",
      files: [backupPath],
    });
  },
};
