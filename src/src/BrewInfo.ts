import { ShellCmd, ExecRunStatus } from "./ShellCmd";
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'

export enum PackageType{
  cask,
  formula
}

export class BrewInfo {

  private async runCmd(str: string, status: Ref){  
    const shellCmd = new ShellCmd(str);
    status.value = `Running: ${shellCmd.cmd}`
    try {
    await shellCmd.doCmd();
    if (shellCmd.execRunStatus !== ExecRunStatus.SUCCESS) { 
      status.value = `Failed  ${shellCmd.cmd}: ${shellCmd.result[shellCmd.result.length - 1].str}`;
      throw new Error( status.value )
    }
    return shellCmd;
  } catch(e) {
    status.value = e.message
    throw e
  }
  }


  private  getResultString(sc: ShellCmd){
    return sc.result.filter((r)=>{return r.exeStatus === ExecRunStatus.SUCCESS}).map( (r)=>{return  r.str}).join(" ")
  }

  async getPackageInfo(packageType: PackageType, packageName: string, status: Ref){
    let cmd = `/usr/local/bin/brew info --cask ${packageName}`
    if (packageType === PackageType.formula) {
      cmd = `/usr/local/bin/brew info --formula ${packageName}`
    }
    const cmdObj =  await this.runCmd(cmd, status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }

  private externalTerminalCmd(cmd: string){
    return `echo "${cmd};rm /tmp/tmp.sh;" > /tmp/tmp.sh ; chmod +x /tmp/tmp.sh ; open -a Terminal /tmp/tmp.sh ; `
  }

  async doUpgrade(packageType: PackageType, packageName: string, status: Ref){
    let cmd = `/usr/local/bin/brew upgrade --cask ${packageName}`
    if (packageType === PackageType.formula) {
      cmd = `/usr/local/bin/brew upgrade --formula ${packageName}`
    }
    
    const cmdObj =  await this.runCmd(this.externalTerminalCmd(cmd), status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }


  async doUpgradeAll(status: Ref){
    const cmd = `/usr/local/bin/brew upgrade`
    
    const cmdObj =  await this.runCmd(this.externalTerminalCmd(cmd), status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }

  async doDoctor(status: Ref){
    const cmd = `/usr/local/bin/brew doctor`
    
    const cmdObj =  await this.runCmd(this.externalTerminalCmd(cmd), status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }

  async doUninstall(packageType: PackageType, packageName: string, status: Ref){
    let cmd = `/usr/local/bin/brew uninstall --cask ${packageName}`
    if (packageType === PackageType.formula) {
      cmd = `/usr/local/bin/brew uninstall --formula ${packageName}`
    }
    
    const cmdObj =  await this.runCmd(this.externalTerminalCmd(cmd), status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }

  async doInstall(packageType: PackageType, packageName: string, status: Ref){
    let cmd = `/usr/local/bin/brew install --cask ${packageName}`
    if (packageType === PackageType.formula) {
      cmd = `/usr/local/bin/brew install --formula ${packageName}`
    }
    
    const cmdObj =  await this.runCmd(this.externalTerminalCmd(cmd), status)
    status.value = `Finished`
    return this.getResultString( cmdObj )
  }


  async doPin( packageName: string, status: Ref){
    const cmd = `/usr/local/bin/brew pin ${packageName}`

    const cmdObj =  await this.runCmd(cmd, status)

    status.value = `Finished`
    return this.getResultString( cmdObj )
  }

  async doUnpin( packageName: string, status: Ref){
    const cmd = `/usr/local/bin/brew unpin ${packageName}`

    const cmdObj =  await this.runCmd(cmd, status)

    status.value = `Finished`
    return this.getResultString( cmdObj )
  }
  async getInfo(status: Ref) {
    try { 
    await this.runCmd("/usr/local/bin/brew update", status)

    const brewLsCask =  await this.runCmd("/usr/local/bin/brew ls --cask -1", status)
    
    const casksNames = this.getResultString( brewLsCask ).split("\n").filter((s) => { return s !== "" })
    
    const brewCasksInfo = await this.runCmd( `/usr/local/bin/brew cask info --json=v1 ${casksNames.join(" ")}` , status)  
    const brewLsFormulas = await this.runCmd("/usr/local/bin/brew info --json --installed", status);
    const brewOutdated = await this.runCmd("/usr/local/bin/brew outdated --json=v2", status);

    status.value = `Finished`
    return new FormatData(this.getResultString( brewCasksInfo ), this.getResultString( brewLsFormulas ),this.getResultString( brewOutdated ) );
    
    } catch (e) {
      debugger;
      console.log(e)
      throw e
    }
    
  }
}