/* @flow */
import { generateId, generateRandomHexString } from '../util.js';
import type { SessionDocR, SessionDocW } from './types.js';
import type { Collection } from '../store/types.js';

type Deps = {
  collection: Collection<SessionDocR, SessionDocW>
};

class Session {
  deps: Deps;

  constructor(deps: Deps) {
    this.deps = deps;
  }

  async get(token: ?string): Promise<SessionDocR> {
    let doc = await this.deps.collection.find({ token: token || '' });

    if (!doc) {
      const _id = generateId();
      const tok = generateRandomHexString();
      doc = await this.deps.collection.put({ _id, token: tok });
    }

    return doc;
  }
}

export default Session;
