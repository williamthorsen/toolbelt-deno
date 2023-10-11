#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-run --allow-write --unstable

// Import Deno's built-in modules which are replacements for Node's child_process and fs
import { execSequence } from './helpers/exec.ts';
import { commonScripts, optionalScripts } from './workspace-scripts.ts';
// import { realpathSync, readTextFileSync } from 'https://deno.land/std@0.203.0/fs/mod.ts';

// import { assertIsDenoConfig } from "./assertIsDenoConfig.ts";

const OK_CODE = 0;
const ERROR_CODE = 1;

let args = [...Deno.args];

const includes = getIncludes(args);

const scripts = getScripts(includes);
args = args.filter((arg) => !arg.startsWith('--include='));

// TODO: Enable when JSONC parsing is supported
// const denoConfig = getDenoConfig();

async function handleCommand(): Promise<void> {
  if (args.length === 0) {
    showHelp(OK_CODE);
  }

  const [key, ...scriptArgs] = args;

  if (!key || key === '-?' || key === '--help') {
    showHelp(OK_CODE);
  }

  if (key in scripts) {
    const scriptCommand = expandScript(scripts[key]);
    if (!scriptCommand) {
      console.error(`Script not defined: ${key}`);
      Deno.exit(ERROR_CODE); // Replaces `process.exit` in Node
    }
    const commands = [scriptCommand, ...scriptArgs].join(' ').split(' && ');
    try {
      await execSequence(commands, { verbose: false });
    } catch (e) {
      console.error(e);
      Deno.exit(ERROR_CODE);
    }
  } else {
    console.error(`Unknown script: ${key}`);
    Deno.exit(ERROR_CODE);
  }
}

function getScripts(includes: string[]): Record<string, string | []> {
  let scripts = { ...commonScripts };
  for (const include of includes) {
    if (include in optionalScripts) {
      if (include in optionalScripts) {
        scripts = { ...scripts, ...optionalScripts[include] };
      } else {
        console.error(`Unknown include: ${include}`);
        Deno.exit(ERROR_CODE);
      }
    }
  }

  return scripts;
}

function expandScript(script: string | string[] | undefined): string {
  if (!script) {
    return '';
  } else if (typeof script === 'string') {
    return script;
  } else {
    return script
      .map((s) => `deno run ws ${s}`)
      .join(' && ');
  }
}

function getIncludes(args: string[]): string[] {
  const includeArgs = args.filter((arg) => arg.startsWith('--include='));
  return includeArgs.flatMap((arg) => {
    const [_, includeList] = arg.split('=');
    return includeList.split(',');
  });
}

function describeScript(script: string | string[] | undefined): string {
  if (!script) {
    return '';
  }
  if (typeof script === 'string') {
    return script;
  } else {
    return `deno task [${script.join(', ')}]`;
  }
}

function showHelp(code: number): never {
  console.info('Usage: deno task ws {script}');
  console.info('Available scripts:');

  for (const key in scripts) {
    console.log(`  ${key.padEnd(15)} ${describeScript(scripts[key])}`);
  }
  Deno.exit(code);
}

await handleCommand();
