import { Events } from "discord.js";
import { addDays, formatDistanceToNow } from "date-fns";

import { getXataClient } from "./../xata.js";

export async function logYogaMessage(message, xataClient = getXataClient()) {
  // console.log({ message });
  // Get channel
  const messageContent = message.content.trim();

  // Ignore bot messages
  if (message.author.bot) return;
  // Ignore if not in yoga channel
  if (message.channel.name.toLowerCase() !== "yoga") return;
  // Ignore if message does not start with ✅
  if (!messageContent.startsWith("✅")) return;

  // This should be "✅" or "✅-3" etc
  const logContent = messageContent.split(" ")[0];

  // When removing ✅ from logContent should have "-3", "-1", "" etc
  const timeShiftNumber = parseInt(logContent.replace("✅", ""));

  // Description
  const description = messageContent.replace(logContent, "").trim();

  // Get the dates right
  const creationDate = new Date(message.createdTimestamp);
  const editedTimestamp = message.editedTimestamp
    ? new Date(message.editedTimestamp)
    : null;
  let logDate = creationDate;

  if (!isNaN(timeShiftNumber)) {
    logDate = addDays(logDate, timeShiftNumber);
  }

  // Create reply content
  const readableData = formatDistanceToNow(logDate, {
    addSuffix: true,
  });
  const replyContent = `Logged your ${readableData} yoga session${
    description && ": " + description
  }`;

  // Get record if exists
  const existingRecord = await xataClient.db.log.read(message.id);
  let replyId = existingRecord?.replyId;

  if (!replyId) {
    // Reply and save reply message id
    const reply = await message.reply(replyContent);
    replyId = reply.id;
  } else {
    // Update existing reply
    const existingReply = await message.channel.messages.fetch(replyId);
    await existingReply.edit(replyContent);
  }

  // Save to Xata
  const record = await xataClient.db.log.createOrUpdate({
    id: message.id,
    createdTimestamp: creationDate,
    editedTimestamp: editedTimestamp,
    logDate: logDate,
    description: description,
    discordUserId: message.author.id,
    replyId: replyId,
  });

  console.log({ record });

  await message.react("🏴‍☠️");
}

export default (discordClient) => {
  discordClient.on(Events.MessageCreate, (message) => {
    console.log(">>>>>", Events.MessageCreate);
    logYogaMessage(message);
  });
  discordClient.on(Events.MessageUpdate, (_message, updated) => {
    console.log(">>>>>", Events.MessageUpdate);
    logYogaMessage(updated);
  });
};
