'use strict';

const { runTransformTest } = require('codemod-cli');

runTransformTest({
  name: 'async-to-generator',
  path: require.resolve('./index.js'),
  fixtureDir: `${__dirname}/__testfixtures__/`,
});
