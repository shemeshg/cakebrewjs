import { ShellCmdUi } from "./ShellCmdUi"
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'


export enum PackageType {
  cask,
  formula
}

let brewLocation = ""

export class BrewInfo extends ShellCmdUi {

  
  private async setBrewLocation(status: Ref){
    if (brewLocation) {return brewLocation;}
    else {
      const cmdObj = await this.runCmd([["which brew"]], status)  
      brewLocation = this.getResultString(cmdObj).trim()       
    }
  }

  async getPackageInfo(packageType: PackageType, packageName: string, status: Ref) {
    await this.setBrewLocation(status);
    let cmd = [brewLocation, "info", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [brewLocation, "info", "--formula", packageName]
    }
    const cmdObj = await this.runCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  // eslint-disable-next-line 
  async getCaskTrashSizeReport(localSearchItem: any, status: Ref) {
    await this.setBrewLocation(status);
    // eslint-disable-next-line 
    const trashAry = localSearchItem[0].artifacts.filter((row: any) => { return row.trash })
    if (trashAry.length === 0) { trashAry[0] = { trash: [] } }

    const cmdObj = await this.runCmd([[`echo $(${brewLocation} --prefix)/Caskroom/`]], status)
    status.value = `Finished`

    const caskRoomPath = this.getResultString(cmdObj).trim()

    if (typeof trashAry[0].trash === 'string' || trashAry[0].trash instanceof String) {
      trashAry[0].trash = [trashAry[0].trash]
    }

    let trashWithArtifact = trashAry[0].trash.concat([])

    let retStr = ""
    if (trashWithArtifact.length > 0) {
      trashWithArtifact = trashWithArtifact.map( (str: string)=>{return str.replace(/^\$\(brew --prefix\)/,"/usr/local");})

      // eslint-disable-next-line 
      let cmd = ["du", "-hsH"].concat(trashWithArtifact)
      cmd = cmd.concat("2>/dev/null|cat")
      const cmdObj = await this.runCmd([cmd], status)
      status.value = `Finished`

      retStr = this.getResultString(cmdObj)
    }

    const caskRooomFolder = caskRoomPath + localSearchItem[0].token.trim() + "/" + localSearchItem[0].installed
    let cmd = ["find " + caskRooomFolder + " -print0 | xargs -0 du -shHc | tail -n 1 "]
    cmd = cmd.concat("2>/dev/null|cat")

    const cmdObj1 = await this.runCmd([cmd], status)
    status.value = `Finished`

    retStr = retStr + "\nCaskRooom Folder " + this.getResultString(cmdObj1)

    return retStr;



  }



  async doUpgrade(packageType: PackageType, packageName: string, status: Ref) {
    await this.setBrewLocation(status);
    let cmd = [brewLocation, "upgrade", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [brewLocation, "upgrade", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeAll(status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "upgrade"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeSelected(formulas: string[], casks: string[], status: Ref) {
    await this.setBrewLocation(status);
    if (formulas.length === 0 && casks.length === 0) { return }

    const cmd: string[][] = []
    if (casks.length > 0) {
      let c: string[] = []
      c = c.concat([brewLocation, "upgrade", "--cask"])
      c = c.concat(casks)
      cmd.push(c)
    }

    if (formulas.length > 0) {
      let c: string[] = []
      c = c.concat([brewLocation, "upgrade", "--formula"])
      c = c.concat(formulas)
      cmd.push(c)
    }

    await this.runExtermalCmd(cmd, status)


    status.value = `Finished`
  }


  async doDoctor(status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "doctor"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async startService(name: string, status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "services", "start", name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async stopService(name: string, status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "services", "stop", name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUninstall(packageType: PackageType, packageName: string, status: Ref, zap = false) {
    await this.setBrewLocation(status);
    let cmd = [brewLocation, "uninstall", "--cask"]
    if (packageType === PackageType.formula) {
      cmd = [brewLocation, "uninstall", "--formula"]
    }

    if (packageType === PackageType.cask && zap) {
      cmd.push("--zap")
    }

    cmd.push(packageName)
    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doInstall(packageType: PackageType, packageName: string, status: Ref) {
    await this.setBrewLocation(status);
    let cmd = [brewLocation, "install", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [brewLocation, "install", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doPin(packageName: string, status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "pin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUnpin(packageName: string, status: Ref) {
    await this.setBrewLocation(status);
    const cmd = [brewLocation, "unpin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  private async getInfo(status: Ref, doBrewUpdate: boolean) {
    await this.setBrewLocation(status);
    if (doBrewUpdate) {
      await this.runCmd([[brewLocation, "update"]], status)
    }

    const brewLs = await this.runCmd([[brewLocation, "info", "--installed", "--json=v2"]], status);
    const brewOutdated = await this.runCmd([[brewLocation, "outdated", "--json=v2"]], status);
    const brewSservices = await this.runCmd([[brewLocation, "services"]], status);

    status.value = `Finished`
    return new FormatData(this.getResultString(brewLs), this.getResultString(brewOutdated), this.getResultString(brewSservices));

  }

  //eslint-disable-next-line 
  async getInfoToStore(status: Ref, doBrewUpdate: boolean, store: any) {
    const data = await this.getInfo(status, doBrewUpdate);
    store.commit("setBrewCasksInfo", data.brewCasksInfo);
    store.commit("setBrewLsFormulas", data.brewLsFormulas);
    store.commit("setBrewServices", data.brewServices);
  }
}