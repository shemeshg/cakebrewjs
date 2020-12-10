import { ShellCmd, ExecRunStatus } from "./ShellCmd";
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'

export class BrewInfo {

  private async runCmd(str: string, status: Ref){  
    const shellCmd = new ShellCmd(str);
    status.value = `Running: ${shellCmd.cmd}`
    await shellCmd.doCmd();
    if (shellCmd.execRunStatus !== ExecRunStatus.SUCCESS) { 
      status.value = `Failed  ${shellCmd.cmd}: ${shellCmd.result[shellCmd.result.length - 1].str}`;
      throw new Error( status.value )
    }
    return shellCmd;
  }


  private  getResultString(sc: ShellCmd){
    return sc.result.filter((r)=>{return r.exeStatus === ExecRunStatus.SUCCESS}).map( (r)=>{return  r.str}).join(" ")
  }

  async getInfo(status: Ref) {
    await this.runCmd("brew update", status)
    const brewLsCask =  await this.runCmd("brew ls --cask -1", status)
    
    const casksNames = this.getResultString( brewLsCask ).split("\n").filter((s) => { return s !== "" })
    
    const brewCasksInfo = await this.runCmd( `brew cask info --json=v1 ${casksNames.join(" ")}` , status)  
    const brewLsFormulas = await this.runCmd("brew info --json --installed", status);
    const brewOutdated = await this.runCmd("brew outdated --json=v2", status);

    status.value = `Finished`

    return new FormatData(this.getResultString( brewCasksInfo ), this.getResultString( brewLsFormulas ),this.getResultString( brewOutdated ) );
  }
}