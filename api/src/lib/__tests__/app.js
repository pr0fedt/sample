/* @flow */
import assert from 'assert';
import App from '../app.js';

describe('app.js', () => {
  it('should start main job', () => {
    const app = new App(async () => assert(true));
    app.run({});
  });
});
