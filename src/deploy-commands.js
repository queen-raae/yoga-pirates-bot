import { REST, Routes } from 'discord.js' ;
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_TOKEN } from "./config.js";
import yogalog from "./commands/yogalog.js";

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_CLIENT_TOKEN);

const commands = [
  yogalog.data.toJSON()
]

// and deploy your commands!
try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = await rest.put(
    Routes.applicationCommands(DISCORD_CLIENT_ID),
    { body: commands },
  );

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}
