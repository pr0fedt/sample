/* @flow */
import { generateId } from '../util.js';
import type { PostDocR, PostDocW, GetPostResult } from './types.js';
import type { Collection } from '../store/types.js';

type Deps = {
  collection: Collection<PostDocR, PostDocW>
};


class Post {
  deps: Deps;
  constructor(deps: Deps) {
    this.deps = deps;
  }

  async get(size: number = 10, offset: number = 0): Promise<GetPostResult> {
    const total = await this.deps.collection.count();
    const items = await this.deps.collection.list({ size, offset });
    return { total, items };
  }

  async write(title: string, content: string, session: string): Promise<void> {
    const _id = generateId();
    await this.deps.collection.put({ _id, title, content, session });
  }

  async remove(_id: string, session: string): Promise<void> {
    await this.deps.collection.remove({ _id, session });
  }
}

export default Post;
