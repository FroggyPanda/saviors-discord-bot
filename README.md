<div align="center">
  <img src="./images/Header-Image.png" height="250px"/>
</div>

## Get started

If you have never made a discord bot give [discordjs.guide](https://discordjs.guide/) a try.

To get started use [PNPM](https://pnpm.io/).

```
pnpm i
```

## Formmating

All file types listed here must follow this fomatting to be usable by the loading functions of the bot.
(they can be expanded on but must follow this boilerplate)

### Command Files

All command files must export a `const command` to have the the command loader work.

```js
import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('NAME OF PLUGIN HERE')
    .setDescription('DESCRIPTION OF PLUGIN HERE'),

  async execute(interaction) {
    await interaction.reply('REPLY GOES HERE');
  },
};
```

### Event Files

All event files must export a `const event` to have the the event loader work.

```js
import { Events } from 'discord.js';

export const event = {
  name: Events.[EVENT TYPE HERE],
  execute(client) {
    console.log('Event Fired');
  },
};
```

## Third Party Documentation

[![Discord JS](https://img.shields.io/badge/Discord.JS-000?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
