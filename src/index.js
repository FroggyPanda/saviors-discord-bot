import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import LoadCommands from './modules/LoadCommands.js';
import LoadEvents from './modules/LoadEvents.js';
import NodeCache from 'node-cache';
import { createClient } from '@supabase/supabase-js';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const UpdateDatabase = async (key, objToUpdate) => {
  const { error } = await supabase
    .from('test')
    .update(objToUpdate)
    .eq('uuid', key);

  if (error) console.log(JSON.stringify(error));
};

export const cache = new NodeCache({ stdTTL: 10 });
cache.on('del', async (key, value) => {
  console.log('del value: ', value);

  if (value.createdTimestamp !== undefined) {
    UpdateDatabase(key, { createdTimestamp: value.createdTimestamp });
  }

  if (value.xp !== undefined) {
    UpdateDatabase(key, { xp: value.xp });
  }

  if (value.level !== undefined) {
    UpdateDatabase(key, { level: value.level });
  }
});

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

client.commands = new Collection();

LoadCommands(client, __dirname);
LoadEvents(client, __dirname);

client.login(process.env.TOKEN);
