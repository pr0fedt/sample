/* @flow */
import type {
  MethodSignature,
  Request,
  Response
} from '../types.js';

import type { PostModel, SessionModel } from '../model/types.js';

type Deps = {
  post: PostModel,
  session: SessionModel
};

class RootMethod {
  deps: Deps;
  _sig: MethodSignature;
  constructor(deps: Deps) {
    this._sig = {
      type: 'GET',
      url: '/'
    };

    this.deps = deps;
   }

  sig(): MethodSignature {
    return this._sig;
  }

  async call(req: Request): Promise<Response> {
    const { t, size, offset } = req.query;
    const session = await this.deps.session.get(t);
    const posts = await this.deps.post.get(size, offset);
    const { _id, token } = session;

    return {
      _id,
      token,
      posts
    };
  }
}

export default RootMethod;
