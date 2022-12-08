import { Events } from 'discord.js';
import ms from 'ms';
import { supabase, cache } from '../index.js';

const Level = async (interaction) => {
  const interactionAuthorID = interaction.author.id;
  const interactionCreatedTimestamp = interaction.createdTimestamp;
  const getData = async (id) => {
    const { data, error } = await supabase
      .from('test')
      .select('uuid::text, createdTimestamp, xp, level')
      .eq('uuid', interactionAuthorID.toString())
      .filter('uuid', 'eq', id.toString());

    return { data, error };
  };

  // create cache if not in cache already
  if (cache.get(interactionAuthorID) == undefined) {
    console.log('created cache');

    let db = await getData(interactionAuthorID);

    if (db.data.length === 0) {
      console.log('insert data');
      const { error } = await supabase
        .from('test')
        .insert({ uuid: interactionAuthorID });

      if (error) console.error(error);
    }

    // TODO@FroggyPanda : figure out if there is a way to not have to call the API twice
    db = await getData(interactionAuthorID);
    cache.set(db.data[0].uuid, db.data[0]);
  }

  // check if msg is older than designated time than one in cache
  if (
    interactionCreatedTimestamp >=
    cache.get(interactionAuthorID).createdTimestamp + ms('5s')
  ) {
    console.log('msg is older than 1min than the last msg');

    const GetXP = async () => {
      const { data, error } = await supabase
        .from('test')
        .select('xp')
        .eq('uuid', interactionAuthorID.toString());
      if (error) {
        console.error(error);
        return;
      }
      return data[0].xp;
    };

    const GetLevel = async () => {
      const { data, error } = await supabase
        .from('test')
        .select('level')
        .eq('uuid', interactionAuthorID.toString());
      if (error) {
        console.error(error);
        return;
      }
      return data[0].level;
    };

    cache.set(interactionAuthorID, {
      ...cache.get(interactionAuthorID),
      createdTimestamp: interactionCreatedTimestamp,
      xp: cache.get(interactionAuthorID).xp + 1 || (await GetXP()) + 1,
      level: cache.get(interactionAuthorID).level || (await GetLevel()),
    });
    console.log('  ', cache.get(interactionAuthorID));
  }
};

export const event = {
  name: Events.MessageCreate,
  async execute(interaction) {
    Level(interaction);
  },
};
