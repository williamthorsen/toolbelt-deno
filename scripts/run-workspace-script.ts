#!/usr/bin/env deno

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';

import { assertIsDenoConfig } from './assertIsDenoConfig.ts';

const OK_CODE = 0;
const ERROR_CODE = 1;

const args = process.argv.slice(2);
const allowPublish = args.includes('--allow-publish');
const scripts = getScripts(allowPublish);

if (allowPublish) {
  args.shift();
}

const denoConfig = getDenoConfig();

function handleCommand(): void {
  if (args.length === 0) {
    showHelp(OK_CODE);
  }

  const key = args[0];
  const scripts = getScripts(allowPublish);

  if (!key || key === '-?' || key === '--help') {
    showHelp(OK_CODE);
  }

  if (key in scripts) {
    const overrideScript = getOverrideScript(key);
    if (overrideScript) {
      console.info(`Using override script: ${overrideScript}`);
    } else {
      if (typeof overrideScript === 'string') {
        console.info('Override script is defined but empty. Skipping script.');
        process.exit(OK_CODE);
      }
    }

    const standardScript = expandScript(scripts[key]);
    const script = overrideScript ?? standardScript;
    if (!script) {
      console.error(`Script not defined: ${key}`);
      process.exit(ERROR_CODE);
    }
    try {
      execSync(script, { stdio: 'inherit' });
    } catch {
      process.exit(ERROR_CODE);
    }
  } else {
    console.error(`Unknown script: ${key}`);
    process.exit(ERROR_CODE);
  }
}

function assertIsError(value: unknown): asserts value is Error {
  if (!(value instanceof Error)) {
    console.error(value);
    throw new TypeError('Expected an Error');
  }
}

function getOverrideScript(scriptName: string): string | undefined {
  return denoConfig.scripts?.[scriptName];
}

/**
 * Returns the contents of `package.json` as an object.
 */
function getDenoConfig() {
  const denoConfigPath = fs.realpathSync(process.cwd() + '/package.json');
  const content = JSON.parse(fs.readFileSync(denoConfigPath, 'utf-8'));
  try {
    assertIsDenoConfig(content);
  } catch (error) {
    assertIsError(error);
    console.error(error.message);
    process.exit(ERROR_CODE);
  }
  return content;
}

function getScripts(useIntTests = false): Record<string, string | []> {
  const commonScripts: Record<string, string | string[]> = {
    'check': '../scripts/check.sh',
    'test:coverage': '../scripts/test-coverage.sh',
    'typecheck': '../scripts/typecheck.sh',
    'view-coverage': 'deno coverage --lcov cov_profile > tracefile.lcov && genhtml --output-directory ./coverage tracefile.lcov && open coverage/index.html',
  };

  const publishScripts = {
    'build': 'deno run --allow-env --allow-net --allow-read --allow-run=pnpm --allow-write=dist scripts/build-node-module.ts',
    'publish': 'deno run --allow-net --allow-read --allow-run=pnpm --allow-write=dist ../../scripts/publish-node-module.ts',
  };

  return {
    ...commonScripts,
    ...(allowPublish ?  publishScripts : {}),
  };
}

function expandScript(script: string | string[] | undefined): string {
  if (!script) {
    return '';
  } else if (typeof script === 'string') {
    return script;
  } else {
    return script
      .map((s) => `pnpm run ws ${s}`)
      .join(' && ');
  }
}

function describeScript(script: string | string[] | undefined): string {
  if (!script) {
    return '';
  }
  if (typeof script === 'string') {
    return script;
  } else {
    return `pnpm run [${script.join(', ')}]`;
  }
}

function showHelp(code: number): never {
  console.info('Usage: deno task ws {script}');
  console.info('Available scripts:');

  for (const key in scripts) {
    console.log(`  ${key.padEnd(15)} ${describeScript(scripts[key])}`);
  }
  process.exit(code);
}

handleCommand();
