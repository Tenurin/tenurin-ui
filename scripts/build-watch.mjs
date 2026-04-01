import { spawn } from 'node:child_process';
import process from 'node:process';

const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const watchCommands = [
  ['exec', 'vite', 'build', '--watch'],
  ['exec', 'tsc', '-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput'],
];

const children = watchCommands.map((args) =>
  spawn(packageManager, args, {
    stdio: 'inherit',
  }),
);

const stopChildren = (signal = 'SIGTERM') => {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

let exiting = false;

const handleExitSignal = (signal) => {
  if (exiting) {
    return;
  }

  exiting = true;
  stopChildren(signal);
};

process.on('SIGINT', () => handleExitSignal('SIGINT'));
process.on('SIGTERM', () => handleExitSignal('SIGTERM'));

let remainingChildren = children.length;
let exitCode = 0;

for (const child of children) {
  child.on('exit', (code, signal) => {
    remainingChildren -= 1;

    if (signal != null) {
      exitCode = 1;
    } else if (code != null && code !== 0) {
      exitCode = code;
    }

    if (!exiting && exitCode !== 0) {
      exiting = true;
      stopChildren();
    }

    if (remainingChildren === 0) {
      process.exit(exitCode);
    }
  });
}
