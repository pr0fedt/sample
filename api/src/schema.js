/* @flow */
import type { Method } from './types.js';

class Schema {
  _methods: Array<Method>;

  constructor() {
    this._methods = [];
  }

  add(method: Method): void {
    this._methods.push(method);
  }

  getArray(): Array<Method> {
    return this._methods;
  }
}

export default Schema;
