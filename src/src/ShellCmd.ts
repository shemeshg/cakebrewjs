import {Ls} from "../src/Ls"

const exec = require("electron").remote.require("child_process").exec

class ExeStatus {
  static SUCCESS = 0
  static ERROR = 1
}

export class ExecRunStatus extends ExeStatus {
  static IDILE = 2
  static RUNNING = 3
}



export interface ExeOut {
  exeStatus: ExeStatus;
  str: string;
}



export class ShellCmd {
  cmd: string;
  result: ExeOut[];
  execRunStatus: ExecRunStatus = ExecRunStatus.IDILE
  // eslint-disable-next-line
  private child: any;

  constructor(cmd: string, result: ExeOut[] = []) {
    this.cmd =  cmd;
    this.result = result;

  }

  kill() {
    return this.child.kill()
  }

  doCmd() {



    return new Promise((resolve, reject) => {

      this.result.length = 0
      const result = this.result;
      let exitCodeExe = -1;
      let enddedBeforOndata = false;
  
      this.execRunStatus = ExecRunStatus.RUNNING
      // eslint-disable-next-line 
      this.child = exec(this.cmd, {maxBuffer: Ls.stdoutMaxBuffer}, (e: any, std: string, err: string) => {
        if (exitCodeExe === -1) {
          enddedBeforOndata = true
          if (e !== null && result.length === 0) {
            result.push({ exeStatus: ExeStatus.ERROR, str: err });
          }
        }

        if (e === null) {
          this.execRunStatus = ExecRunStatus.SUCCESS
          resolve(this.execRunStatus)
        } else {
          this.execRunStatus = ExecRunStatus.ERROR
          if (e.code === null && e.message) {
            result.push({ exeStatus: ExeStatus.ERROR, str: e.message });
          }
          reject(e)
        }
      });

      this.child.stdout.on('data', function (data: string) {
        result.push({ exeStatus: ExeStatus.SUCCESS, str: data });
      });

      this.child.stderr.on('data', function (data: string) {
        result.push({ exeStatus: ExeStatus.ERROR, str: data });
      });

      this.child.on('close', function (exitCode: number) {
        exitCodeExe = exitCode;
        resolve(exitCode)
      });

      if (enddedBeforOndata) {
        this.execRunStatus = ExecRunStatus.ERROR
        resolve(exitCodeExe)
      }

    })



  }

}