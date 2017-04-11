/* @flow */
import Schema from './schema.js';
import MemoryStore from './store/memory.js';
import SessionModel from './model/session.js';
import PostModel from './model/post.js';
import RootMethod from './methods/root.js';
import AddPostMethod from './methods/add-post.js';
import RemovePostMethod from './methods/remove-post.js';

import type { Collection, Store } from './store/types.js';
import type { SessionDocR, SessionDocW, PostDocR, PostDocW } from './model/types.js';
type Deps = {};

type Modules = {
  schema: Schema
};

type Collections = {
  session: Collection<SessionDocR, SessionDocW>,
  post: Collection<PostDocR, PostDocW>
};

function getCollections(store: Store): Collections {
  return {
    session: store.getCollection('sessions'),
    post: store.getCollection('posts')
  };
}

export async function getModules(deps: Deps): Promise<Modules> {
  const store = new MemoryStore;
  const collections = getCollections(store);

  const post = new PostModel({ collection: collections.post });
  const session = new SessionModel({ collection: collections.session });

  const rootMethod = new RootMethod({ post, session });
  const addPostMethod = new AddPostMethod({ post, session });
  const removePostMethod = new RemovePostMethod({ post, session })
  const schema = new Schema;

  schema.add(rootMethod);
  schema.add(addPostMethod);
  schema.add(removePostMethod);

  return {
    schema
  };
};
