/**
 * Check for yarn.
 * @overview Prevents installing using `npm`; forces using `yarn`.
 */

// NOTE: If you want to reuse this functionality in other projects, you'll need
// to copy this file. It's not possible to use this from a package because it
// needs to be run before packages are installed.

/* eslint-disable no-console */

'use strict'; // eslint-disable-line

const reset = '\x1B[0m';
const redBold = '\x1B[1;91m';
const yellow = '\x1B[0;33m';
const execpath = process.env.npm_execpath;

if (execpath && execpath.indexOf('yarn.js') === -1) {
  console.log(`
---------------------------------------------------------------------------
 ${redBold}ERROR:${reset} This project uses yarn for package management. Do not use npm!
 Please install yarn from https://yarnpkg.com and then run \`${yellow}yarn install${reset}\`.
---------------------------------------------------------------------------
\n`);

  process.exit(1);
}
