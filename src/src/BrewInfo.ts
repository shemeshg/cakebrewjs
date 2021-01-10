import { ShellCmd, ExecRunStatus } from "./ShellCmd";
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'

export enum PackageType {
  cask,
  formula
}

export class BrewInfo {

  private async runCmd(str: string[], status: Ref, noEscapedString = "") {

    let shellCmd: ShellCmd;
    if (noEscapedString) {
      shellCmd = new ShellCmd(noEscapedString)
    } else {
      shellCmd = new ShellCmd(this.getEscapedCmd(str));
    }

    
    status.value = `Running: ${shellCmd.cmd}`
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

  private getEscapedCmd(str: string[]) {
    return str.reduce((p, c) => { return p + ` ${this.escapeCmdParam(c)} ` })
  }

  private getResultString(sc: ShellCmd) {
    return sc.result.filter((r) => { return r.exeStatus === ExecRunStatus.SUCCESS }).map((r) => { return r.str }).join("")
  }

  async getPackageInfo(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "info", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "info", "--formula", packageName]
    }
    const cmdObj = await this.runCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  private escapeCmdParam(s: string) {
    return s.replace(/(["\s'$`\\])/g, '\\$1')
  }


  // eslint-disable-next-line 
  async getCaskTrashSizeReport(localSearchItem: any, status: Ref) {
    // eslint-disable-next-line 
    const trashAry = localSearchItem[0].artifacts.filter((row: any) => { return row.trash })

    if (trashAry.length > 0) {
      // eslint-disable-next-line 
      const cmd = ["du", "-hs"].concat(trashAry[0].trash).concat("2>/dev/null|cat")
      const cmdObj = await this.runCmd(cmd, status)
      status.value = `Finished`

      return this.getResultString(cmdObj)
    }
    return "";


  }

  private externalTerminalCmd(cmd: string[]) {
    const tmpFile = `/tmp/${(new Date()).getTime()}.sh`

    const writeFileSync = require("electron").remote.require("fs").writeFileSync;
    const str = `trap "rm ${tmpFile}" EXIT;${this.getEscapedCmd(cmd)};`
    writeFileSync(tmpFile, str, 'utf-8');
    const cmdStr = `chmod +x ${tmpFile} ; open -a Terminal ${tmpFile} ; `

    return { tmpFile: tmpFile, cmdStr: cmdStr }
  }

  async doUpgrade(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "upgrade", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "upgrade", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
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

  private async runExtermalCmd(cmd: string[], status: Ref) {
    const ecmd = this.externalTerminalCmd(cmd)
    const w = this.waitForTmpFile(ecmd.tmpFile)
    const cmdObj = await this.runCmd([], status, ecmd.cmdStr);
    await w;
    return cmdObj;

  }

  async doUpgradeAll(status: Ref) {
    const cmd = ["/usr/local/bin/brew", "upgrade"]

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeSelected(formulas: string[], casks: string[], status: Ref) {
    if (formulas.length === 0 && casks.length === 0) { return }

    const cmd: string[] = []
    if (casks.length > 0) {
      cmd.concat(["/usr/local/bin/brew", "upgrade", "--cask"]).concat(casks)
      if (formulas.length > 0) cmd.concat(";")
    }

    if (formulas.length > 0) {
      cmd.concat(["/usr/local/bin/brew", "upgrade", "--formula"]).concat(formulas)
    }

    await this.runExtermalCmd(cmd, status)


    status.value = `Finished`
  }


  async doDoctor(status: Ref) {
    const cmd = ["/usr/local/bin/brew", "doctor"]

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async startService(name: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "services","start",name]

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async stopService(name: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "services","stop",name]

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUninstall(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "uninstall", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "uninstall", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doInstall(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "install", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "install", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doPin(packageName: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "pin", packageName]

    const cmdObj = await this.runCmd(cmd, status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUnpin(packageName: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "unpin", packageName]

    const cmdObj = await this.runCmd(cmd, status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }
  async getInfo(status: Ref, doBrewUpdate: boolean) {
    if (doBrewUpdate) {
      await this.runCmd(["/usr/local/bin/brew", "update"], status)
    }

    const brewLs = await this.runCmd(["/usr/local/bin/brew", "info", "--installed", "--json=v2"], status);
    const brewOutdated = await this.runCmd(["/usr/local/bin/brew", "outdated", "--json=v2"], status);
    const brewSservices = await this.runCmd(["/usr/local/bin/brew", "services"], status);

    status.value = `Finished`
    return new FormatData(this.getResultString(brewLs), this.getResultString(brewOutdated), this.getResultString(brewSservices));

  }
}