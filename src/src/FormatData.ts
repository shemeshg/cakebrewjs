export class FormatData {
  // eslint-disable-next-line
  brewCasksInfo: any[];
  // eslint-disable-next-line
  brewLsFormulasStr: any[]
  
  constructor (brewCasksInfoStr: string, brewLsFormulasStr: string , brewOutdatedStr: string){
    this.brewCasksInfo = JSON.parse( brewCasksInfoStr )
    this.brewLsFormulasStr = JSON.parse( brewLsFormulasStr )
    const brewOutdated = JSON.parse(brewOutdatedStr)
    console.log("add outdated info to formula and casks and outdated key to casks")
    console.log(brewOutdated)
    debugger;
  }
}