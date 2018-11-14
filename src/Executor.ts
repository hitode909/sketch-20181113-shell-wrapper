import child_process from 'child_process';

interface ExecuteResult {
  key: string,
  command: string,
  parameters: string[];
  env: Object,
  cwd: string,
  stdout: string;
  stderr: string;
  code: number;
  invokedAt: number,
  exitedAt: number,
}

export class Executor {
  execute(parameters: string[]): Promise<ExecuteResult> {
    return new Promise((resolve, reject) => {
      const result = {
        key: '',
        env: process.env,
        parameters: parameters,
        command: parameters.join(' '),
        cwd: process.cwd(),
        invokedAt: new Date().getTime(),
        exitedAt: 0,
        stdout: '',
        stderr: '',
        code: -1,
      };
      result.key = [result.invokedAt, result.command].join('-');
      const buffer = child_process.spawn(parameters[0], parameters.slice(1));
      buffer.stdout.on('data', (data) => {
        process.stdout.write(data);
        result.stdout += data;
      });
      buffer.stderr.on('data', (data) => {
        process.stderr.write(data);
        result.stderr += data;
      });
      buffer.on('close', (code) => {
        result.code = code;
        result.exitedAt = new Date().getTime();
        resolve(result);
      });

      buffer.on('error', (err) => {
        reject(result);
      });
    });
  }
}
