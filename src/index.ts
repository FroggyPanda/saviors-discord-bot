import { dirname, importx } from '@discordx/importer';
import boxen from 'boxen';
import chalk from 'chalk';
import { GatewayIntentBits, Interaction, Message } from 'discord.js';
import { config } from 'dotenv';
import { Client } from 'discordx';
import { createClient } from '@supabase/supabase-js';
import Cache from './lib/cache.js';
import general from './config/general.js';
import { Database } from './schema.js';
config();

const __dirname = dirname(import.meta.url);

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  silent: false,
});

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

type User = {
  id: number;
  user_uid: string;
  xp: number;
  level: number;
  server_uid: string;
  last_message_timestamp: number;
};

type Server = {
  id: number;
  server_uid: string;
};

export const cache = new Cache<{ user: User; server: Server }>(
  general.cache.timeOfLife
);

const getData = () => {
  supabase
    .from('server')
    .select()
    .then((result) => {
      if (result.error) {
        console.error(result.error);
        return;
      }

      Object.keys(result.data).map((key) => {
        cache.set('server', result.data[key].id, result.data[key]);
      });
    });

  supabase
    .from('user')
    .select()
    .then((result) => {
      if (result.error) {
        console.error(result.error);
        return;
      }

      Object.keys(result.data).map((key) => {
        cache.set('user', result.data[key].id, result.data[key]);
      });
    });
};

const submitData = async () => {
  const userPayload = cache.get('user');
  const userError = await supabase.from('user').upsert(userPayload);

  const serverPayload = cache.get('server');
  const serverError = await supabase.from('server').upsert(serverPayload);

  if (userError) console.error(userError);
  if (serverError) console.error(serverError);
};

client.once('ready', async () => {
  await client.guilds.fetch();
  await client.initApplicationCommands();

  console.log(
    boxen(chalk.green.bold(`${client.user.tag} running`), {
      padding: 0.5,
      borderStyle: 'round',
    })
  );
});

client.on('interactionCreate', (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

client.on('messageCreate', (message: Message) => {
  client.executeCommand(message);
});

cache.on('endOfLife', () => {
  submitData();
  getData();
});

const run = async () => {
  await importx(`${__dirname}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.TOKEN) {
    throw Error('Could not find TOKEN in your environment');
  }

  await client.login(process.env.TOKEN);
};

run();
