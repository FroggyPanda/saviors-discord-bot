import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import LoadCommands from './modules/LoadCommands.js';
import LoadEvents from './modules/LoadEvents.js';
import Cache from './lib/cache.js';
import { createClient } from '@supabase/supabase-js';
import general from './config/general.js';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const getData = () => {
  supabase
    .from('test')
    .select()
    .then((result) => {
      if (result.error) {
        console.error(result.error);
        return;
      }

      Object.keys(result.data).map((key) => {
        cache.set('test', result.data[key].uuid, result.data[key]);
      });
    });
};

const submitData = async () => {
  for (const table in cache.data) {
    const payload = [];
    for (const [k, v] of cache.data[table]) {
      payload.push(v);
    }
    console.log(table);
    console.table(payload);
    const { error } = await supabase.from(table.toString()).upsert(payload);
    if (error) console.error(error);
  }
};

export const cache = new Cache(general.cache.timeOfLife);

getData();

cache.on('endOfLife', () => {
  submitData();
  getData();
});

client.commands = new Collection();

LoadCommands(client, __dirname);
LoadEvents(client, __dirname);

client.login(process.env.TOKEN);
