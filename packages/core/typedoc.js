const pack = require('./package');
const Handlebars = require('handlebars');

const BASE_URL = '/core/';

Handlebars.registerHelper('relativeURL', function (url) {
  return BASE_URL + url;
});

module.exports = {
  entryPointStrategy: 'packages',
  entryPoints: ['packages/core'],
  out: 'docs',
  exclude: [
    '**/node_modules/**',
    '**/rollup.*.*(ts|js)',
    '**/*+(index|.spec|.test|.e2e).ts',
    './tools/**.ts',
  ],

  name: pack.name,
  excludePrivate: true,
  readme: './README.md',
  plugin: 'typedoc-plugin-markdown',
};
