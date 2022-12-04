import chalk from 'chalk';
import { Events } from 'discord.js';

export const event = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
      const username = chalk.blue.bold(
        `${interaction.user.username}#${
          interaction.user.discriminator
        } ${chalk.red.bold(`(${interaction.user.id})`)}`
      );
      const end = chalk.white(`ran ${interaction.commandName}`);
      console.log(username + ' ' + end);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
