import { Events } from 'discord.js';
import general from '../config/general.js';
import { supabase, cache } from '../index.js';

const Level = async (interaction) => {
  const interactionAuthorID = interaction.author.id;
  const interactionCreatedTimestamp = interaction.createdTimestamp;

  // create cache if not in cache already
  if (cache.get('test', interactionAuthorID) === false) {
    console.log('created cache');
    const { data, error } = await supabase
      .from('test')
      .insert({ uuid: interactionAuthorID })
      .select();

    if (error) {
      console.error(error);
      return;
    }

    cache.set('test', data[0].uuid, data[0]);
  }

  // check if msg is older than designated time than one in cache
  if (
    interactionCreatedTimestamp >=
    cache.get('test', interactionAuthorID).createdTimestamp +
      general.messageCreate.timeSpan
  ) {
    console.log('msg is older than 1min than the last msg');

    const SetXpAndLevel = async (id) => {
      let xp = cache.get('test', id).xp + 1;
      let level = cache.get('test', id).level;

      if (5 * (level ^ 2) + 50 * level + 100 - xp <= 0) {
        level++;
        xp = 0;
      }
      return { xp, level };
    };
    cache.set('test', interactionAuthorID, {
      ...cache.get('test', interactionAuthorID),
      createdTimestamp: interactionCreatedTimestamp.toString(),
      ...(await SetXpAndLevel(interactionAuthorID)),
    });
  }
};

export const event = {
  name: Events.MessageCreate,
  async execute(interaction) {
    Level(interaction);
  },
};
