import { Message } from 'discord.js';
import { Discord, On } from 'discordx';
import general from '../config/general.js';
import { cache, supabase } from '../index.js';

const Level = async (message: Message) => {
  const messageAuthorID = message.author.id;
  const messageCreatedTimestamp = message.createdTimestamp;
  const cacheArrayLength = cache
    .get('user')
    .filter((v) => v.user_uid === messageAuthorID).length;
  let cacheID =
    cacheArrayLength === 0
      ? null
      : cache.get('user').filter((v) => v.user_uid === messageAuthorID)[0].id;

  // create cache if not in cache already
  if (
    !cache.get('user') ||
    cache.get('user').filter((v) => v.user_uid === messageAuthorID).length === 0
  ) {
    console.log('MessageCreate.ts > created cache');
    const { data, error } = await supabase
      .from('user')
      .insert({ user_uid: messageAuthorID, server_uid: message.guildId })
      .select();
    if (error) {
      console.error(error);
      return;
    }

    cache.set('user', data[0].id, data[0]);
    cacheID = data[0].id;
  }

  if (
    messageCreatedTimestamp >=
    cache.get('user', cacheID).last_message_timestamp +
      general.messageCreate.timeSpan
  ) {
    console.log(`user ${messageAuthorID} msg is older than the last message`);

    const SetXpAndLevel = async (id: number) => {
      let xp = cache.get('user', id).xp + 1;
      let level = cache.get('user', id).level;

      if (5 * (level ^ 2) + 50 * level + 100 - xp <= 0) {
        level++;
        xp = 0;
      }

      return { xp, level };
    };

    cache.set('user', cacheID, {
      ...cache.get('user', cacheID),
      last_message_timestamp: messageCreatedTimestamp,
      ...(await SetXpAndLevel(cacheID)),
    });
  }
};

@Discord()
class MessageCreate {
  @On({ event: 'messageCreate' })
  onMessage(message: Message) {
    Level(message[0]);
  }
}
