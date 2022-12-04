import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import LoadCommands from './modules/LoadCommands.js';
import LoadEvents from './modules/LoadEvents.js';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

LoadCommands(client, __dirname);
LoadEvents(client, __dirname);

client.login(process.env.TOKEN);
