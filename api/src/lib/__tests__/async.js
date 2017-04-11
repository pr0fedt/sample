/* @flow */
import assert from 'assert';
import { sleep, Signal, Semaphore } from '../async.js';

describe('async.js', () => {
  it('should process for more than a second', async () => {
    const now = Date.now();
    await sleep(1000);
    assert(Date.now() - now > 1000);
  });

  // TODO Signal
  // TODO Semaphore
});
