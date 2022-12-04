import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const LoadCommands = async (callback) => {
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file:///${filePath}`);
    commands.push(command.command.data.toJSON());
  }
  callback();
};

const PushCommands = async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID,
        process.env.DEV_GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

LoadCommands(PushCommands);
