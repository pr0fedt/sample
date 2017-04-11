/* @flow */
import http from 'http';
import x from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import Context from './context.js';
import { wrapMethod } from './wrappers.js';
import type { Method, Schema } from './types.js';

type Deps = {
  config: {
    hostname: string,
    port: number,
    ssl?: boolean
  },
  schema: Schema
};

class Server {
  _x: x.Express;
  deps: Deps;
  constructor(deps: Deps) {
    this.deps = deps;
    this._x = x();
  }

  _listen(): Promise<void> {
    const { hostname, port, ssl } = this.deps.config;

    return new Promise((resolve, reject) => {
      let server;

      if (!ssl) {
        server = http.createServer(this._x);
      } else {
        // TODO ssl
        reject(new Error('not implemented'));
      }

      if (server) {
        this._x.listen(port, hostname, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('empty server'));
      }
    });
  }

  async startup(): Promise<void> {
    this._x.enable('trust proxy'); // TODO config

    this._x.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*"); // TODO cors config
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.locals.ctx = new Context;
      next();
    });

    this._x.use(methodOverride());
    this._x.use(bodyParser.urlencoded({ extended: false }));
    this._x.use(bodyParser.json());
    this._x.use(cookieParser());

    for (const method of this.deps.schema.getArray()) {
      const { type: httpMethod, url } = method.sig();
      console.log({ httpMethod, url });

      switch (httpMethod) {
        case 'HEAD': {
          this._x.head(url, wrapMethod(method));
          break;
        }

        case 'GET': {
          this._x.get(url, wrapMethod(method));
          break;
        }

        case 'POST': {
          this._x.post(url, wrapMethod(method));
          break;
        }

        case 'PUT': {
          this._x.put(url, wrapMethod(method));
          break;
        }

        case 'DELETE': {
          this._x.delete(url, wrapMethod(method));
          break;
        }

        default:
          (httpMethod: null);
      }
    }

    // TODO error handling

    await this._listen();
  }

  async shutdown(): Promise<void> {
  }
}

export default Server;
