/* @flow */
import { Signal } from './lib/async.js';
type ContextState = 'Canceled' | 'Done' | 'Ready';

class Context {
  state: ContextState;
  ts: number;
  _cancelSignal: Signal<number>;
  _doneSignal: Signal<number>;

  constructor() {
    this.state = 'Ready';
    this.ts = Date.now();
    this._cancelSignal = new Signal;
    this._doneSignal = new Signal;
  }

  cancel(): number {
    if (this.ready()) {
      const took = Date.now() - this.ts;
      this.state = 'Canceled';
      this._cancelSignal.emit(took);
      return took;
    } else {
      throw new Error('cannot cancel');
    }
  }

  finish(): number {
    if (this.ready()) {
      const took = Date.now() - this.ts;
      this.state = 'Done';
      this._doneSignal.emit(took);
      return took;
    } else {
      throw new Error('cannot finish');
    }
  }

  isCanceled(): boolean {
    return this.state === 'Canceled';
  }

  isDone(): boolean {
    return this.state === 'Done';
  }

  ready(): boolean {
    return this.state === 'Ready';
  }

  async wait(): Promise<number> {
    if (!this.ready()) {
      throw new Error(`wrong state: ${this.state}`);
    }
    return Promise.race([this._doneSignal.wait(), this._cancelSignal.wait()]);
  }
}

export default Context;
