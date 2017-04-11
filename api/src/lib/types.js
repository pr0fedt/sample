/* @flow */
export type EnvDesc = {
  name: string,
  required?: boolean,
  default?: string,
  desc?: string
};

export type EnvSig = { [name: string]: EnvDesc };
export type Env = { [name: string]: ?string };
export type Job = (env: Env) => Promise<void>;
