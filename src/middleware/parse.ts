import type { Next, Req, Res } from '../types';

/**
 * Parse raw request body data and convert it to JSON.
 * NOTE: This is intentionally simple and should not be considered
 * secure. Do not use anywhere security is important!!
 *
 * @deprecated Use the `@polka/parse` package instead;
 * <https://github.com/lukeed/polka/tree/next/packages/parse>.
 */
export function parse(req: Req, res: Res, next: Next): void {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.once('end', () => {
    req.rawBody = data;

    const contentType = req.headers['content-type'];

    if (contentType && contentType.includes('application/json')) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.body = JSON.parse(data);
      } catch (err) {}
    }

    next();
  });
}
