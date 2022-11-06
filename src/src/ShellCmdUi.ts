import { ShellCmd, ExecRunStatus } from "./ShellCmd";
import { Ref } from '@vue/composition-api'

export class ShellCmdUi {


  private getEscapedCmd(strRows: string[][], strJoinWith=";") {
    const row: string[] = []
    strRows.forEach( str =>{
      row.push( str.reduce((p, c) => { return p + ` ${this.escapeCmdParam(c)} ` }) )
    })
    return row.join(strJoinWith)
  }

  private escapeCmdParam(s: string) {
    return s.replace(/([";&|\s'$`\\])/g, '\\$1')
  }

  private externalTerminalCmd(cmd: string[][]) {
    const tmpFile = `/tmp/${(new Date()).getTime()}.sh`

    const writeFileSync = require("electron").remote.require("fs").writeFileSync;
    const str = `trap "rm ${tmpFile}" EXIT;${this.getEscapedCmd(cmd)};`
    writeFileSync(tmpFile, str, 'utf-8');
    const cmdStr = `chmod +x ${tmpFile} ; open -a Terminal ${tmpFile} ; `

    return { tmpFile: tmpFile, cmdStr: cmdStr }
  }


  private waitForTmpFile(tmpFile: string) {
    return new Promise((resolve) => {
      try {
        const watch = require("electron").remote.require("fs").watch;
        const watcher = watch(tmpFile, (e: string) => {
          if (e !== "change") { watcher.close(); resolve(""); }
        });
      } catch (e) {
        //reject(e);
        resolve("");
      }

    })
  }

  protected async runCmd(str: string[][], status: Ref, noEscapedString = "", moreInfo = "", strJoinWith=";") {

    let shellCmd: ShellCmd;
    if (noEscapedString) {
      shellCmd = new ShellCmd(noEscapedString)
    } else {
      shellCmd = new ShellCmd(this.getEscapedCmd(str,strJoinWith));
    }

    
    status.value = `${moreInfo} Running: ${shellCmd.cmd}`
    try {
      await shellCmd.doCmd();
      if (shellCmd.execRunStatus !== ExecRunStatus.SUCCESS) {
        status.value = `Failed  ${shellCmd.cmd}: ${shellCmd.result[shellCmd.result.length - 1].str}`;
        throw new Error(status.value)
      }
      return shellCmd;
    } catch (e) {
      status.value = e.message
      throw e
    }
  }


  protected getResultString(sc: ShellCmd) {
    return sc.result.filter((r) => { return r.exeStatus === ExecRunStatus.SUCCESS }).map((r) => { return r.str }).join("")
  }

  protected async runExtermalCmd(cmd: string[][], status: Ref) {
    const ecmd = this.externalTerminalCmd(cmd)
    const w = this.waitForTmpFile(ecmd.tmpFile)
    const cmdObj = await this.runCmd([], status, ecmd.cmdStr, this.getEscapedCmd(cmd) +"</br>");
    await w;
    return cmdObj;

  }



}

