import fs from 'fs';
import path from 'path';

const LoadEvents = async (client, __dirname) => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file:///${filePath}`);
    const ee = event.event;
    if (ee.once) {
      client.once(ee.name, (...args) => ee.execute(...args));
    } else {
      client.on(ee.name, (...args) => ee.execute(...args));
    }
  }
};

export default LoadEvents;
