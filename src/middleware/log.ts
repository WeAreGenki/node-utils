/* eslint-disable no-console, security/detect-object-injection */

import { cyan, green, red, yellow } from 'colorette';
import type { Next, Req, Res } from '../types';

const units = ['B', 'kB', 'MB', 'GB', 'TB'];

/**
 * Convert a number to no more than 2 trailing numbers after the decimal.
 */
function toSignificant(num: number): string {
  return `${parseFloat(num.toFixed(2))}`;
}

/**
 * Convert bytes into a human readable representation.
 */
function humanizeSize(bytes: number): string {
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  if (index < 0) return '';
  return `${toSignificant((bytes / 1024) ** index)} ${units[index]}`;
}

/**
 * Simple Node server request logger.
 *
 * Don't use this in serious apps for production, instead opt for a high
 * performance solution like [pino](https://github.com/pinojs/pino-http).
 */
export function log(req: Req, res: Res, next: Next): void {
  const start = process.hrtime();
  const write = res.write.bind(res);
  let byteLength = 0;

  // Monkey patch write method to calculate response size (doesn't factor in
  // multibyte characters so the true byte size may differ)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.write = (chunk: string | Buffer, encoding?: any, cb?: any) => {
    if (chunk) byteLength += chunk.length;
    return write(chunk, encoding, cb);
  };

  function writeLog(): void {
    const duration = process.hrtime(start)[1] / 1e6;
    const { method, originalUrl, url } = req;
    const { statusCode } = res;
    // eslint-disable-next-line no-nested-ternary
    const color = statusCode >= 400 ? red : statusCode >= 300 ? yellow : green;
    const timing = `${toSignificant(duration)}ms`;
    const size = humanizeSize(byteLength);
    console.log(
      `» ${timing} ${color(`${statusCode}`)} ${method || 'NO_METHOD'} ${
        originalUrl || url || 'NO_URL'
      }${cyan(size)}`,
    );
  }

  res.once('finish', writeLog);
  res.once('error', writeLog);

  next();
}
