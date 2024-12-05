import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const username = process.env.QUEUE_USERNAME;
    const password = process.env.QUEUE_PASSWORD;
    const encodedCreds = Buffer.from(username + ':' + password).toString('base64');

    const reqCreds = req.get('authorization')?.split('Basic ')?.[1] ?? null;

    if (!reqCreds || reqCreds !== encodedCreds) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Your realm", charset="UTF-8"');
      res.sendStatus(401);
    } else {
      next();
    }
  }
}
