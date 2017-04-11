/* @flow */
const noop = () => {};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export class Signal<T> {
  _promise: Promise<T>;
  _resolve: (val: T) => void;
  _reject: (err: Error) => void;

  constructor() {
    const promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    // prevent unhandled rejections from showing up
    promise.catch(noop);

    this._promise = promise;
  }

  wait(): Promise<T> {
    return this._promise;
  }

  emit(val: T) {
    this._resolve(val);
  }

  fail(err: Error) {
    this._reject(err);
  }

  // TODO this doesn't really work with T other than void
  toCallback(d: T): (err: ?Error, r: ?T) => void {
    return (err: ?Error, r: ?T) => {
      if (err) {
        this.fail(err);
      } else {
        this.emit(r || d);
      }
    };
  }
}

export class Semaphore {
  _n: number;
  _r: Signal<void>;

  constructor(n: number) {
    this._n = n >>> 0;
    this._r = new Signal();
  }

  async acquire(n: number): Promise<void> {
    const nn = n >>> 0;

    while (this._n < nn) {
      await this._r.wait();
    }

    this._n -= nn;
  }

  release(n: number) {
    const nn = n >>> 0;

    this._n += nn; // TODO handle overreleasing?

    const r = this._r;
    this._r = new Signal();
    r.emit();
  }
}
