import boxen from 'boxen';
import chalk from 'chalk';
import { Events } from 'discord.js';

export const event = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(
      boxen(chalk.green.bold(`${client.user.tag} running`), {
        padding: 0.5,
        borderStyle: 'round',
      })
    );
  },
};
