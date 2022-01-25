'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.nodeCJS();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['__tests__/**/*.js'],
      env: {
        jest: true,
      },
    },
  ],
};
