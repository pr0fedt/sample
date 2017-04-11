/* @flow */
export type ListOptions = {
  size?: number,
  offset:? number
};

export type Query = {
  [field: string]: any // TODO
};

export type Id = string;
export type Timestamp = number;

export type GenericDocR = {
  _id: Id,
  _cts: Timestamp,
  _uts: Timestamp
};

export type GenericDocW = {
  _id: Id
};

export interface Collection<R, W> {
  count(): Promise<number>;
  list(opts: ListOptions): Promise<Array<R>>;
  find(q: Query): Promise<?R>;
  put(doc: W): Promise<R>;
  remove(q: Query): Promise<void>;
}

export interface Store {
  getCollection(name: string): Collection<*, *>
};
