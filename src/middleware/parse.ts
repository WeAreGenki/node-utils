import { IReq, IRes, Next } from '../types';

/**
 * Parse raw request body data and convert it to JSON.
 */
export function parse(req: IReq, res: IRes, next: Next): void {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.once('end', () => {
    req.rawBody = data;
    const contentType = req.headers['content-type'];
    if (contentType && contentType.indexOf('application/json') === 0) {
      req.body = JSON.parse(data);
    }
    next();
  });
}
