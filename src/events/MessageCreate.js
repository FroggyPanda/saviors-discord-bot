import { Events } from 'discord.js';
import general from '../config/general.js';
import { supabase, cache } from '../index.js';

const Level = async (interaction) => {
  const interactionAuthorID = interaction.author.id;
  const interactionCreatedTimestamp = interaction.createdTimestamp;
  const cacheArrayLength = cache
    .get('user')
    .filter((v) => v.user_uid === interactionAuthorID).length;
  let cacheUserID =
    cacheArrayLength === 0
      ? null
      : cache.get('user').filter((v) => v.user_uid === interactionAuthorID)[0]
          .id;

  // create cache if not in cache already
  if (
    !cache.get('user') ||
    cache.get('user').filter((v) => v.user_uid === interactionAuthorID)
      .length === 0
  ) {
    console.log('created cache');
    const { data, error } = await supabase
      .from('user')
      .insert({
        user_uid: interactionAuthorID,
        server_uid: interaction.guildId,
      })
      .select();

    if (error) {
      console.error(error);
      return;
    }

    cache.set('user', data[0].id, data[0]);
    cacheUserID = data[0].id;
  }

  if (
    interactionCreatedTimestamp >=
    cache.get('user', cacheUserID).last_message_timestamp +
      general.messageCreate.timeSpan
  ) {
    console.log(
      `user ${interactionAuthorID} msg is older than the last message`
    );

    const SetXpAndLevel = async (id) => {
      let xp = cache.get('user', id).xp + 1 || 0;
      let level = cache.get('user', id).level || 0;

      if (5 * (level ^ 2) + 50 * level + 100 - xp <= 0) {
        level++;
        xp = 0;
      }
      return { xp, level };
    };

    cache.set('user', cacheUserID, {
      ...cache.get('user', cacheUserID),
      last_message_timestamp: interactionCreatedTimestamp,
      ...(await SetXpAndLevel(cacheUserID)),
    });
  }
};
export const event = {
  name: Events.MessageCreate,
  async execute(interaction) {
    Level(interaction);
  },
};
