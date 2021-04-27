/* eslint-disable import/no-extraneous-dependencies, no-console */

import esbuild from 'esbuild';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/** @param {Error|null} err */
function handleErr(err) {
  if (err) throw err;
}

/** @type {import('esbuild').BuildOptions} */
const common = {
  entryPoints: ['src/index.ts'],
  external: ['colorette'],
  target: ['node14'],
  platform: 'node',
  bundle: true,
  sourcemap: true,
  minifySyntax: true,
  watch: dev,
  logLevel: 'debug',
};

// ESM
esbuild
  .build({
    ...common,
    outfile: 'dist/index.mjs',
    format: 'esm',
  })
  .catch(handleErr);

// CJS
esbuild
  .build({
    ...common,
    outfile: 'dist/index.js',
    format: 'cjs',
  })
  .catch(handleErr);
