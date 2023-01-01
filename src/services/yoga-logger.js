import { Events } from "discord.js";
import { addDays } from "date-fns";

export async function logYogaMessage(message, { xataClient, discordClient }) {
  console.log({ message });
  // Get channel
  const channel = await discordClient.channels.fetch(message.channelId);
  const messageContent = message.content.trim();

  // Ignore bot messages
  if (message.author.bot) return;
  // Ignore if not in yoga channel
  if (channel.name.toLowerCase() !== "yoga") return;
  // Ignore if message does not start with ✅
  if (!messageContent.startsWith("✅")) return;

  // This should be "✅" or "✅-3" etc
  const logContent = messageContent.split(" ")[0];

  // When removing ✅ from logContent should have "-3", "-1", "" etc
  const timeShiftNumber = parseInt(logContent.replace("✅", ""));

  const creationDate = new Date(message.createdTimestamp);
  const editedTimestamp = message.editedTimestamp
    ? new Date(message.editedTimestamp)
    : null;
  let logDate = creationDate;

  if (!isNaN(timeShiftNumber)) {
    logDate = addDays(logDate, timeShiftNumber);
  }

  const record = await xataClient.db.log.createOrUpdate({
    id: message.id,
    createdTimestamp: creationDate,
    editedTimestamp: editedTimestamp,
    logDate: logDate,
    description: messageContent.replace(logContent, "").trim(),
    discordUserId: message.author.id,
  });

  console.log({ record });

  message.react("🏴‍☠️");
}

export default ({ discordClient, xataClient }) => {
  discordClient.on(Events.MessageCreate, (message) => {
    console.log(">>>>>", Events.MessageCreate);
    logYogaMessage(message, { xataClient, discordClient });
  });
  discordClient.on(Events.MessageUpdate, (_message, updated) => {
    console.log(">>>>>", Events.MessageUpdate);
    logYogaMessage(updated, { xataClient, discordClient });
  });
};
