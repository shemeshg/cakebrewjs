import { ShellCmdUi } from "./ShellCmdUi"
import { FormatData } from "./FormatData"
import { Ref } from '@vue/composition-api'
import {Ls} from "./Ls"

export enum PackageType {
  cask,
  formula
}



export class BrewInfo extends ShellCmdUi {



  async getPackageInfo(packageType: PackageType, packageName: string, status: Ref) {
    let cmd = [Ls.brewLocation, "info", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [Ls.brewLocation, "info", "--formula", packageName]
    }
    const cmdObj = await this.runCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async getSearch(textSearch: string, status: Ref){
    let cmdCask = [[Ls.brewLocation, "search", "--cask", textSearch]]
    cmdCask = cmdCask.concat([["/usr/bin/xargs", Ls.brewLocation,"info","--cask","--json=v2"]])
    
    let cmdFormula = [[Ls.brewLocation, "search", "--formula", textSearch]]
    cmdFormula = cmdFormula.concat([["/usr/bin/xargs", Ls.brewLocation,"info","--formula","--json=v2"]])

    const cmdObjCask = await this.runCmd(cmdCask, status,undefined,undefined,"|")
    status.value = `Finished`
    const caskResult =  this.getResultString(cmdObjCask)

    const cmdObjFormula = await this.runCmd(cmdFormula, status,undefined,undefined,"|")
    status.value = `Finished`
    const formulaResult =  this.getResultString(cmdObjFormula)

    return {caskResult ,formulaResult};

  }

  // eslint-disable-next-line 
  async getCaskTrashSizeReport(localSearchItem: any, status: Ref) {
    // eslint-disable-next-line 
    const trashAry = localSearchItem[0].artifacts.filter((row: any) => { return row.trash })
    if (trashAry.length === 0) { trashAry[0] = { trash: [] } }

    const cmdObj = await this.runCmd([[`echo $(${Ls.brewLocation} --prefix)/Caskroom/`]], status)
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
    let cmd = [Ls.brewLocation, "upgrade", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [Ls.brewLocation, "upgrade", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeAll(status: Ref) {
    const cmd = [Ls.brewLocation, "upgrade"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doUpgradeSelected(formulas: string[], casks: string[], status: Ref) {
    if (formulas.length === 0 && casks.length === 0) { return }

    const cmd: string[][] = []
    if (casks.length > 0) {
      let c: string[] = []
      c = c.concat([Ls.brewLocation, "upgrade", "--cask"])
      c = c.concat(casks)
      cmd.push(c)
    }

    if (formulas.length > 0) {
      let c: string[] = []
      c = c.concat([Ls.brewLocation, "upgrade", "--formula"])
      c = c.concat(formulas)
      cmd.push(c)
    }

    await this.runExtermalCmd(cmd, status)


    status.value = `Finished`
  }


  async doDoctor(status: Ref) {
    const cmd = [Ls.brewLocation, "doctor"]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async startService(name: string, status: Ref) {
    const cmd = [Ls.brewLocation, "services", "start", name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async stopService(name: string, status: Ref) {
    const cmd = [Ls.brewLocation, "services", "stop", name]

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUninstall(packageType: PackageType, packageName: string, status: Ref, zap = false) {
    let cmd = [Ls.brewLocation, "uninstall", "--cask"]
    if (packageType === PackageType.formula) {
      cmd = [Ls.brewLocation, "uninstall", "--formula"]
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
    let cmd = [Ls.brewLocation, "install", "--cask", packageName]
    if (packageType === PackageType.formula) {
      cmd = [Ls.brewLocation, "install", "--formula", packageName]
    }

    const cmdObj = await this.runExtermalCmd([cmd], status)
    status.value = `Finished`
    return this.getResultString(cmdObj)
  }


  async doPin(packageName: string, status: Ref) {
    const cmd = [Ls.brewLocation, "pin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  async doUnpin(packageName: string, status: Ref) {
    const cmd = [Ls.brewLocation, "unpin", packageName]

    const cmdObj = await this.runCmd([cmd], status)

    status.value = `Finished`
    return this.getResultString(cmdObj)
  }

  private async getInfo(status: Ref, doBrewUpdate: boolean) {
    if (doBrewUpdate) {
      await this.runCmd([[Ls.brewLocation, "update"]], status)
    }

    const brewLs = await this.runCmd([[Ls.brewLocation, "info", "--installed", "--json=v2"]], status);
    const brewOutdated = await this.runCmd([[Ls.brewLocation, "outdated", "--json=v2"]], status);
    const brewSservices = await this.runCmd([[Ls.brewLocation, "services","--json"]], status);

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