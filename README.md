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

```js
import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class Ping {
  @Slash({
    name: 'Ping',
    description: 'What do I reply with?',
  })
  nameOfCommand(interaction: CommandInteraction) {
    interaction.reply('Pong');
  }
}
```

### Event Files

```js
import { Message } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
class MessageCreate {
  @On({ event: 'messageCreate' })
  onMessage(message: Message) {
    console.log(message);
  }
}
```

## Third Party Documentation

[![Discord JS](https://img.shields.io/badge/Discord.JS-000?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![DiscordX](https://img.shields.io/badge/DiscordX-000?style=for-the-badge&logo=Discord&logoColor=white)](https://github.com/discordx-ts/discordx/)
[![Typescript](https://img.shields.io/badge/Typescript-000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
