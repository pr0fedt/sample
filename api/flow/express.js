declare module "express" {
  declare type NextFunction = (error?: Object) => void

  declare class Request {
    headers: {[key: string]: string};
  }

  declare class Response {
    status(statusCode: number): Response;
    json(body: any): Response;
  }
  declare class Express {
    enable(flag: string): void;
    use(mw: any): void;
  }
  declare module.exports: () => Express;
}
