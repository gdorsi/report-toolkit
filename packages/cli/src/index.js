#!/usr/bin/env node

import {
  _,
  constants as commonConstants,
  createDebugger,
  enableDebugger
} from '@report-toolkit/common';
import {loadConfig} from '@report-toolkit/core';
import {
  constants as fsConstants,
  fromFilesystemToConfig
} from '@report-toolkit/fs';
import yargs from 'yargs/yargs.js';

import * as commands from './commands/index.js';

const {DEFAULT_TRANSFORMER, NAMESPACE, SHORT_NAMESPACE} = commonConstants;

const debug = createDebugger('cli', 'main');

/**
 * @todo support color JSON output if TTY
 */
const main = () => {
  _.values(commands)
    .reduce(
      (parser, command) => parser.command(command),
      yargs()
        .scriptName(SHORT_NAMESPACE)
        .demandCommand()
        .options({
          debug: {
            alias: ['verbose'],
            desc: 'Enable debug output',
            global: true,
            type: 'boolean'
          },
          rc: {
            desc: `Custom file or directory path to ${fsConstants.RC_FILENAME}`,
            normalize: true,
            requiresArg: true,
            type: 'string'
          }
        })
        .wrap(
          process.stdout.columns ? Math.min(process.stdout.columns, 100) : 80
        )
        .env(NAMESPACE)
        .help()
        .version()
        .middleware(async argv => {
          // "verbose" enables debug statements
          if (argv.verbose) {
            enableDebugger();
          }

          debug('parsed CLI arguments: %O', argv);
          // any format other than the default "table" will not be in color
          argv.color = _.isUndefined(argv.color)
            ? argv.format !== DEFAULT_TRANSFORMER
            : argv.color;

          argv.config = await loadConfig(
            fromFilesystemToConfig({
              searchPath: argv.rc
            })
          );

          return argv;
        })
    )
    .check(argv => {
      if (argv.output && _.castArray(argv.file).length > 1) {
        throw new Error('--output cannot be combined with multiple files');
      }
      return true;
    })
    .parse(process.argv.slice(2));
};

if (require.main === module) {
  main();
}

export {main};

/**
 * @template T
 * @typedef {import('yargs').Arguments<T>} CLIBaseArguments
 */
/**
 * @typedef {{debug?: boolean, rc?: string, config: object}} CLIGlobalArguments
 */
/**
 * @template T
 * @typedef {CLIBaseArguments<CLIGlobalArguments & T>} CLIArguments<T>
 */
