import { Events } from "discord.js";
import { addDays, format } from "date-fns";

import { getXataClient } from "./../xata.js";

export function truncate(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
}

export function allowedMessage(message) {
  const isNotBot = !message.author.bot;
  const inYogaChannel = message.channel.name.toLowerCase() === "yoga";
  const startsWithCheckMark = message.content.trim().startsWith("✅");

  const isAllowed = isNotBot && inYogaChannel && startsWithCheckMark;
  if (isAllowed) {
    console.log(">>>>>>> allowedMessage", message.content);
  }

  return isAllowed;
}

export async function createOrUpdateYogaSession(
  message,
  xataClient = getXataClient()
) {
  // console.log({ message });

  if (!allowedMessage(message)) return;

  const messageContent = message.content.trim();

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
  let logTimestamp = creationDate;

  if (!isNaN(timeShiftNumber)) {
    logTimestamp = addDays(logTimestamp, timeShiftNumber);
  }

  // Create reply content
  const readableData = format(logTimestamp, "EEEE");
  let replyContent = `☑️ ${readableData} logged${
    description && ": " + truncate(description, 35)
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
    logTimestamp: logTimestamp,
    logDateString: format(logTimestamp, "yyyy-MM-dd"),
    description: description,
    discordUserId: message.author.id,
    replyId: replyId,
  });

  if (existingRecord) {
    console.log(">>>>>>> Updated record", record.id);
  } else {
    console.log(">>>>>>> Created record", record.id);
  }

  await message.react("🏴‍☠️");
}

export async function deleteYogaSession(message, xataClient = getXataClient()) {
  // console.log({ message });

  if (!allowedMessage(message)) return;

  // Get record if exists
  const existingRecord = await xataClient.db.log.read(message.id);
  const replyId = existingRecord?.replyId;

  if (replyId) {
    // Delete existing reply
    const existingReply = await message.channel.messages.fetch(replyId);
    await existingReply.delete();
  }

  // Save to Xata
  const record = await xataClient.db.log.delete(message.id);

  console.log(">>>>>>> Deleted record", record.id);
}

export default (discordClient) => {
  discordClient.on(Events.MessageCreate, (message) => {
    console.log(">>>>> YogaLogger", Events.MessageCreate);
    createOrUpdateYogaSession(message);
  });
  discordClient.on(Events.MessageUpdate, (_message, updated) => {
    console.log(">>>>> YogaLogger", Events.MessageUpdate);
    createOrUpdateYogaSession(updated);
  });
  discordClient.on(Events.MessageDelete, (message) => {
    console.log(">>>>> YogaLogger", Events.MessageDelete);
    deleteYogaSession(message);
  });
};
