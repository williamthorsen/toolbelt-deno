export async function exec(
  command: string,
  options: IOptions = {},
): Promise<IExecResponse> {
  const { output: outputMode = OutputMode.StdOut, verbose = false } = options;

  const splits = splitCommand(command);

  let uuid = '';
  if (verbose) {
    uuid = generateUuid();
    console.log(``);
    console.log(`Exec Context: ${uuid}`);
    console.log(`    Exec Options: `, options);
    console.log(`    Exec Command: ${command}`);
    console.log(`    Exec Command Splits: ${splits}`);
  }

  // deno-lint-ignore no-deprecated-deno-api
  const p = Deno.run({ cmd: splits });

  let response = '';
  const decoder = new TextDecoder();

  if (p && outputMode != OutputMode.None) {
    const buff = new Uint8Array(1);

    while (true) {
      try {
        const result = await p.stdout?.read(buff);
        if (!result) {
          break;
        }

        if (
          outputMode == OutputMode.Capture ||
          outputMode == OutputMode.Tee
        ) {
          response = response + decoder.decode(buff);
        }

        if (
          outputMode == OutputMode.StdOut ||
          outputMode == OutputMode.Tee
        ) {
          await Deno.stdout.write(buff);
        }
      } catch (_ex) {
        break;
      }
    }
  }

  const status = await p.status();
  p.stdout?.close();
  p.stderr?.close();
  p.close();

  const result = {
    status: {
      code: status.code,
      success: status.success,
    },
    output: response.trim(),
  };
  if (options.verbose) {
    console.log('    Exec Result: ', result);
    console.log(`Exec Context: ${uuid}`);
    console.log(``);
  }
  return result;

  /* Saved for when Deno.Command is supported.
  const runCommand = new Deno.Command(firstCommand, { args });
  const commandOutput = await runCommand.output();

  const decoder = new TextDecoder();

  const out = decoder.decode(commandOutput.stdout).trim();
  const err = decoder.decode(commandOutput.stderr).trim();

  if (out) console.log(out);
  if (err) console.error(err);

  const result = {
    status: {
      code: commandOutput.code,
      success: commandOutput.success,
    },
    output: out,
  };
  if (verbose) {
    // console.log('    Exec Result: ', result);
    console.log(`Exec Context: ${uuid}`);
    console.log(``);
  }
  return result;
   */
}

export const execSequence = async (
  commands: string[],
  options: IOptions = {
    output: OutputMode.StdOut,
    continueOnError: false,
    verbose: false,
  },
): Promise<IExecResponse[]> => {
  const { output = OutputMode.StdOut, continueOnError = false, verbose = false } = options;

  const results: IExecResponse[] = [];

  for (let i = 0; i < commands.length; i++) {
    const result = await exec(commands[i]!, { output, continueOnError, verbose });
    results.push(result);
    if (continueOnError == false && result.status.code != 0) {
      break;
    }
  }

  return results;
};

// region | Helpers
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // random number between 0 and 16
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // Calculate based on 'c'
    return v.toString(16); // Convert to hexadecimal
  });
}

function splitCommand(command: string): string[] {
  const myRegexp = /[^\s"]+|"([^"]*)"/gi;
  const splits = [];

  let match = undefined;
  do {
    // Each call to exec returns the next regex match as an array
    match = myRegexp.exec(command);
    if (match !== null) {
      //Index 1 in the array is the captured group if it exists
      //Index 0 is the matched text, which we use if no captured group exists
      splits.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  return splits;
}

export enum OutputMode {
  None = 0, // no output, just run the command
  StdOut, // dump the output to stdout
  Capture, // capture the output and return it
  Tee, // both dump and capture the output
}
// endregion | Helpers

// region | Types
export interface IExecResponse {
  status: IExecStatus;
  output: string;
}

export interface IExecStatus {
  code: number;
  success: boolean;
}

interface IOptions {
  output?: OutputMode;
  verbose?: boolean;
  continueOnError?: boolean;
}
// endregion | Types
