/* @flow */
import x from 'express';

import type {
  Request,
  Response,
  Method,
  Context
} from './types.js';

type XHandler = (req: x.Request, res: x.Response, next?: x.NextFunction) => Promise<void>;

function wrapRequest(req: x.Request): Request {
  const {
    baseUrl,
    body,
    cookies,
    // TODO signedCookies
    headers,
    hostname,
    ips,
    method,
    params,
    protocol,
    query,
    secure,
  } = req;

  return {
    baseUrl,
    body,
    cookies,
    headers,
    hostname,
    ips,
    method,
    params,
    protocol,
    query,
    secure
  };
}

export function wrapMethod(method: Method): XHandler {
  return async (req: x.Request, res: x.Response, next?: x.NextFunction) => {
    const ctx: ?Context = res.locals.ctx;
    let status = 200;
    let took;
    let result;

    try {
      if (!ctx) {
        throw new Error('no context');
      }

      const request = wrapRequest(req);
      console.log(JSON.stringify(request, null, 2));

      const rep = await Promise.race([
        ctx.wait(),
        method.call(request, ctx)
      ]);

      if (ctx.isCanceled()) {
        took = rep;
        throw new Error('request is canceled');
      }

      if (ctx.isDone()) {
        took = rep;
        throw new Error('request has been already finished');
      }

      took = ctx.finish();

      result = {
        success: true,
        took,
        response: rep
      };
    } catch (e) {
      result = {
        success: false,
        took,
        error: {
          message: e.message
        }
      };

      status = 500;
      console.error(e.stack); // TODO logger
    }

    res.status(status).json(result);
  };
}

