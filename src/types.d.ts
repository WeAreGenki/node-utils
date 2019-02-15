// https://github.com/sveltejs/sapper/blob/master/src/interfaces.ts
// https://github.com/sveltejs/sapper/blob/master/templates/src/server/middleware/types.ts

import { ClientRequest, ServerResponse } from 'http';

export interface IReq extends ClientRequest {
  url: string;
  baseUrl: string;
  originalUrl: string;
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string>;
  rawBody: string;
  body: object;
}

// @ts-ignore
export interface IRes extends ServerResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  write: (data: any) => void;
}

export { ServerResponse };

export type Next = () => void;
