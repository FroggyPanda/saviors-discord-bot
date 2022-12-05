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

export const cache = new NodeCache({ stdTTL: 5 * 60 });
cache.on('del', async (key, value) => {
  const { error } = await supabase
    .from('test')
    .update({ createdTimestamp: value })
    .eq('uuid', key);

  if (error) console.log(JSON.stringify(error));
});

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

client.commands = new Collection();

LoadCommands(client, __dirname);
LoadEvents(client, __dirname);

client.login(process.env.TOKEN);
