import type { Arguments, CommandBuilder } from "yargs";
import { isDirectoryTemplate, outputError, spawnWrapper } from "../util/util";
import { trackBuildEventWrapper, trackErrorWrapper } from "../analytics/usage-analytics";

const COMMAND_DESCRIPTION_STRING: string = 'Build the PWA Starter using Vite.';
const VITEARGS_DESCRIPTION_STRING: string = 'Arguments to pass directly to the Vite build process.';

export const command: string = 'build';
export const desc: string = COMMAND_DESCRIPTION_STRING;

const USAGE_STRING: string = '$0 build [viteArgs]';
const EXEC_BUILD_NO_ARGS_STRING: string = 'npm run build';
const EXEC_BUILD_ARGS_STRING: (string) => string = (viteArgs: string) => { return 'npm run build -- ' + viteArgs; }

const INVALID_DIRECTORY_ERROR_STRING: string = `Cannot execute build because the current working directory is not a valid PWA Starter template. 
Make sure you are executing the build command from a PWA Starter template directory.`;

type BuildOptions = {
  viteArgs: string | undefined;
}

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      viteArgs: { type: 'string', description: VITEARGS_DESCRIPTION_STRING}
    })
    .usage(USAGE_STRING);

export const handler = async (argv: Arguments<BuildOptions>): Promise<void> => {
  try {
    trackBuildEventWrapper();
    await handleBuildCommand(argv);
  } catch (error) {
    trackErrorWrapper(error as Error);
  }
};

async function handleBuildCommand(argv: Arguments<BuildOptions>): Promise<void> {
  const { viteArgs } = argv;
  if(isDirectoryTemplate()) {
    spawnBuildCommand(viteArgs); 
  } else {
    outputError(INVALID_DIRECTORY_ERROR_STRING);
  }
}
async function spawnBuildCommand(viteArgs: string | undefined) {
  if(viteArgs) {
    spawnWrapper(EXEC_BUILD_ARGS_STRING(viteArgs)); 
  } else {
    spawnWrapper(EXEC_BUILD_NO_ARGS_STRING);
  }
}