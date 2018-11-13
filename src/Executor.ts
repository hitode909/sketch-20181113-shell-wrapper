import child_process from 'child_process';

interface ExecuteResult {
  parameters: string[];
  stdout: string;
  stderr: string;
  code: number;
}

export class Executor {
  execute(parameters: string[]): Promise<ExecuteResult> {
    return new Promise((resolve, reject) => {
      const result = {
        parameters: parameters,
        stdout: '',
        stderr: '',
        code: -1,
      };
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
        resolve(result);
      });

      buffer.on('error', (err) => {
        reject(result);
      });
    });
  }
}
