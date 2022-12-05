import { Events } from 'discord.js';
import ms from 'ms';
import { supabase, cache } from '../index.js';

export const event = {
  name: Events.MessageCreate,
  async execute(interaction) {
    const interactionAuthorID = interaction.author.id;
    const interactionCreatedTimestamp = interaction.createdTimestamp;

    const { data, error } = await supabase
      .from('test')
      .select('uuid::text, createdTimestamp')
      .eq('uuid', interaction.author.id.toString());

    if (error) {
      console.log(JSON.stringify.error);
      return;
    }

    if (cache.get(interactionAuthorID) == undefined) {
      cache.set(interactionAuthorID, interactionCreatedTimestamp);
      cache.set(data[0].uuid, data[0].createdTimestamp);
      console.log(cache.data);
      console.log(interaction.createdTimestamp);
    }

    if (
      interactionCreatedTimestamp >=
      cache.get(interactionAuthorID) + ms('1m')
    ) {
      console.log('msg is older than 1min than the last msg');
      cache.set(interactionAuthorID, interactionCreatedTimestamp);
      console.log(cache.data);
    }
  },
};
