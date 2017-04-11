/* @flow */
import type { Job, EnvSig } from './types.js';

class App {
  _main: Job;

  constructor(main: Job) {
    this._main = main;
  }

  run(envSignature: EnvSig) {
    const env = {};

    for (const key of Object.keys(envSignature)) {
      const {
        required,
        default: defValue,
        name
      } = envSignature[key];

      const value = process.env[key] || defValue;

      if (!value && required) {
        console.error(`process.env[${key}] not set`);
        process.exit(1);
      }

      env[name] = value;
    }

    this._main(env)
      .catch((e) => {
        console.log(e.stack);
        process.exit(-1);
      });
  }
}

export default App;
