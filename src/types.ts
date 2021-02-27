/* eslint-disable @typescript-eslint/no-explicit-any */

import { IncomingMessage, ServerResponse } from 'http';

export interface Req extends IncomingMessage {
  /**
   * URL before mangling e.g., for internal routing. Express only.
   *
   * @see https://expressjs.com/en/api.html#req.originalUrl
   */
  originalUrl?: string;
  params?: { [key: string]: string };
  query?: { [key: string]: string };
  rawBody?: string;
  body?: { [key: string]: any };
}

export interface Res extends ServerResponse {}

export type Next = () => void;
