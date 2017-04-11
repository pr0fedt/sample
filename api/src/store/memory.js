/* @flow */
import type {
  ListOptions,
  Query,
  GenericDocR,
  GenericDocW,
  Collection
} from './types.js';

class MemoryCollection<R: GenericDocR, W: GenericDocW> {
  _docs: Array<R>;

  constructor() {
    this._docs = [];
  }

  async count(): Promise<number> {
    return this._docs.length;
  }

  async list(opts: ListOptions): Promise<Array<R>> {
    // TODO flow Object.assign bug
    // const { size, offset } = Object.assign({}, { size: 10, offset: 0 }, opts);
    const size = opts.size || 10;
    const offset = opts.offset || 0;

    // TODO кастомная сортировка
    return this._docs.sort(({ _cts: a }, { _cts: b }) => a - b).slice(offset, offset + size);
  }

  async find(q: Query): Promise<?R> {
    return this._docs.find((doc) => {
      for (const key of Object.keys(q)) {
        if (q[key] !== doc[key]) {
          return false;
        }
      }

      return true;
    });
  }

  async put(doc: W): Promise<R> {
    const index = this._docs.findIndex(({ _id }) => _id === doc._id);

    let _uts = Date.now();
    let _cts;

    if (index >= 0) {
      _cts = this._docs.splice(index, 1)[0]._cts;
    } else {
      _cts = Date.now();
    }

    const d: any = Object.assign({}, doc, { _cts, _uts }); // TODO
    this._docs.push(d);
    return d;
  }

  async remove(q: Query): Promise<void> {
    const index = this._docs.findIndex((doc) => {
      for (const key of Object.keys(q)) {
        if (q[key] !== doc[key]) {
          return false;
        }
      }

      return true;
    });

    if (index >= 0) {
      this._docs.splice(index, 1);
    }
  }
}

class MemoryStore {
  _collections: { [name: string]: Collection<*, *> };

  constructor() {
    this._collections = {}
  }

  getCollection(name: string): Collection<*, *> {
    if (!this._collections[name]) {
      this._collections[name] = new MemoryCollection;
    }

    return this._collections[name];
  }
}

export default MemoryStore;
