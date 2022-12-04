import fs from 'fs';
import path from 'path';

const LoadCommands = async (client, __dirname) => {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file:///${filePath}`);
    const cc = command.command;
    if ('data' in cc && 'execute' in cc) {
      client.commands.set(cc.data.name, cc);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

export default LoadCommands;
