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

class RemovePostMethod {
  deps: Deps;
  _sig: MethodSignature;
  constructor(deps: Deps) {
    this._sig = {
      type: 'POST', // TODO delete
      url: '/remove-post'
    };

    this.deps = deps;
  }

  sig(): MethodSignature {
    return this._sig;
  }

  async call(req: Request): Promise<Response> {
    const { t, size, offset } = req.query;
    const { id } = req.body;
    const session = await this.deps.session.get(t);
    await this.deps.post.remove(id, session._id);
    const posts = await this.deps.post.get(size, offset);

    return {
      posts
    };
  }
}

export default RemovePostMethod;
