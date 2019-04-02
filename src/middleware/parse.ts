import { Req, Res, Next } from '../types';

/**
 * Parse raw request body data and convert it to JSON.
 * NOTE: This is intentionally simple and should not be considered
 * secure. Do not use anywhere security is important!!
 */
export function parse(req: Req, res: Res, next: Next): void {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.once('end', () => {
    req.rawBody = data;

    const contentType = req.headers['content-type'];

    if (contentType && contentType.indexOf('application/json') === 0) {
      try {
        req.body = JSON.parse(data);
      } catch (err) {
        // noop
      }
    }

    next();
  });
}
