/* eslint-disable no-console, security/detect-object-injection */

import * as colors from 'colorette';
import { Req, Res, Next } from '../types';

/** Byte size units. Let's hope our requests never get above `kB` ;) */
const units = ['B', 'kB', 'MB', 'GB', 'TB'];

/**
 * Convert bytes into a human readable form.
 */
function humanizeSize(bytes: number): string {
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  if (index < 0) return '';
  return `${+((bytes / 1024) ** index).toFixed(2)} ${units[index]}`;
}

/**
 * Log server requests.
 */
export function log(req: Req, res: Res, next: Next): void {
  const start = process.hrtime();
  const write = res.write.bind(res);
  let byteLength = 0;

  // monkey patch to calculate response byte size
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.write = function writeFn(data: any, ...rest: any[]) {
    if (data) byteLength += data.length;
    return write(data, ...rest);
  };

  function writeLog(): void {
    const duration = process.hrtime(start);
    const { method, originalUrl, url } = req;
    const { statusCode } = res;
    const color =
      // eslint-disable-next-line no-nested-ternary
      statusCode >= 400 ? 'red' : statusCode >= 300 ? 'yellow' : 'green';
    const timing = `${+(duration[1] / 1e6).toFixed(2)}ms`;
    const size = humanizeSize(byteLength);
    // prettier-ignore
    console.log(`» ${timing} ${colors[color](`${statusCode}`)} ${method} ${originalUrl || url} ${colors.cyan(size)}`);
  }

  res.once('finish', writeLog);
  res.once('error', writeLog);

  next();
}
