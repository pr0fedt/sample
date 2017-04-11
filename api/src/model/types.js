/* @flow */
export type SessionDocR = {
  _id: string,
  _cts: number,
  _uts: number,
  token: string,
};

export type SessionDocW = {
  _id: string,
  token: string
};

export type PostDocR = {
  _id: string,
  _cts: number,
  _uts: number,
  title: string,
  content: string,
  session: string
};

export type PostDocW = {
  _id: string,
  title: string,
  content: string,
  session: string
};

export type GetPostResult = {
  total: number,
  items: Array<PostDocR>
};

export interface PostModel {
  get(size: number, offset: number): Promise<GetPostResult>;
  write(title: string, content: string, session: string): Promise<void>;
  remove(_id: string, session: string): Promise<void>;
}

export interface SessionModel {
  get(token: string): Promise<SessionDocR>;
}
