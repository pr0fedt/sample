/* @flow */
import App from './lib/app.js';
import config from './config.js';
import Server from './server.js';
import { getModules } from './modules.js';

const app = new App(async (opts) => {
  const hostname = opts.host;

  if (!hostname) {
    throw new Error('invalid hostname');
  }

  const port = Number(opts.portno);

  if (!Number.isFinite(port)) {
    throw new Error('incorrect port');
  }

  const modules = await getModules({
    // TODO
  });

  const server = new Server({
    config: {
      hostname,
      port
    },

    schema: modules.schema
  });

  await server.startup();

  console.log({
    ts: Date.now(),
    hostname,
    port,
    msg: 'listening'
  });
});

app.run(config);
