/* @flow */
export type Request = any;
export type Response = any;

export type MethodSignature = {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD',
  url: string
};

export interface Method {
  sig(): MethodSignature;
  call(req: Request, ctx?: Context): Promise<Response>;
}

export interface Schema {
  add(method: Method): void;
  getArray(): Array<Method>;
}

export interface Context {
  cancel(): number;
  finish(): number;
  isCanceled(): boolean;
  isDone(): boolean;
  ready(): boolean;
  wait(): Promise<number>;
}
