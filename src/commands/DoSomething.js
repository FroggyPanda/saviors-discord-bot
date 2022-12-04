import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('dosomething')
    .setDescription('summons B.O.B.'),

  async execute(interaction) {
    await interaction.reply('https://www.youtube.com/watch?v=hs-VeJkCRmc');
  },
};
