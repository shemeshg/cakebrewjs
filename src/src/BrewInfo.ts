import {ShellCmdUi} from "./ShellCmdUi"
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'


export enum PackageType {
  cask,
  formula
}

export class BrewInfo extends ShellCmdUi{


  async getPackageInfo(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "info", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "info", "--formula", packageName]
    }
    const cmdObj = await this.runCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  // eslint-disable-next-line 
  async getCaskTrashSizeReport(localSearchItem: any, status: Ref) {
    // eslint-disable-next-line 
    const trashAry = localSearchItem[0].artifacts.filter((row: any) => { return row.trash })

    if (trashAry.length > 0) {
      // eslint-disable-next-line 
      let cmd = ["du", "-hs"].concat(trashAry[0].trash)
      cmd = cmd.concat("2>/dev/null|cat")
      const cmdObj = await this.runCmd([cmd], status)
      status.value = `Finished`

      return this.getResultString(cmdObj)
    }
    return "";
  }



  async doUpgrade(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "upgrade", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "upgrade", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeAll(status: Ref) {
    const cmd = ["/usr/local/bin/brew", "upgrade"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeSelected(formulas: string[], casks: string[], status: Ref) {
    if (formulas.length === 0 && casks.length === 0) { return }

    const cmd: string[][] = []
    if (casks.length > 0) {
      let c: string[] = []
      c = c.concat(["/usr/local/bin/brew", "upgrade", "--cask"])
      c = c.concat(casks)
      cmd.push(c)
    }

    if (formulas.length > 0) {
      let c: string[] = []
      c = c.concat(["/usr/local/bin/brew", "upgrade", "--formula"])
      c = c.concat(formulas)
      cmd.push(c)
    }

    await this.runExtermalCmd(cmd, status)


    status.value = `Finished`
  }


  async doDoctor(status: Ref) {
    const cmd = ["/usr/local/bin/brew", "doctor"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async startService(name: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "services","start",name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async stopService(name: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "services","stop",name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUninstall(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "uninstall", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "uninstall", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doInstall(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = ["/usr/local/bin/brew", "install", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = ["/usr/local/bin/brew", "install", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doPin(packageName: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "pin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUnpin(packageName: string, status: Ref) {
    const cmd = ["/usr/local/bin/brew", "unpin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  private async getInfo(status: Ref, doBrewUpdate: boolean) {
    if (doBrewUpdate) {
      await this.runCmd([["/usr/local/bin/brew", "update"]], status)
    }

    const brewLs = await this.runCmd([["/usr/local/bin/brew", "info", "--installed", "--json=v2"]], status);
    const brewOutdated = await this.runCmd([["/usr/local/bin/brew", "outdated", "--json=v2"]], status);
    const brewSservices = await this.runCmd([["/usr/local/bin/brew", "services"]], status);

    status.value = `Finished`
    return new FormatData(this.getResultString(brewLs), this.getResultString(brewOutdated), this.getResultString(brewSservices));

  }

  //eslint-disable-next-line 
  async getInfoToStore(status: Ref, doBrewUpdate: boolean, store: any){
    const data = await this.getInfo(status, doBrewUpdate);
    store.commit("setBrewCasksInfo", data.brewCasksInfo);
    store.commit("setBrewLsFormulas", data.brewLsFormulas);
    store.commit("setBrewServices", data.brewServices);
  } 
}