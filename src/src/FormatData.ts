export class FormatData {
  // eslint-disable-next-line
  brewCasksInfo: any[];
  // eslint-disable-next-line
  brewLsFormulas: any[]
  
  constructor (brewCasksInfoStr: string, brewLsFormulasStr: string , brewOutdatedStr: string){
    this.brewCasksInfo = JSON.parse( brewCasksInfoStr )
    this.brewLsFormulas = JSON.parse( brewLsFormulasStr )
    const brewOutdated = JSON.parse(brewOutdatedStr)

    // eslint-disable-next-line 
    brewOutdated.formulae.forEach( (r: any ) => {
      this.brewLsFormulas.filter( f => {return f.name ===r.name }).forEach( row =>{
        row.outdated = true;
        row.outdatedData = r
        row.outdatedNewVer = r.current_version
      } )
    });


    // eslint-disable-next-line 
    brewOutdated.casks.forEach( (r: any ) => {
      this.brewCasksInfo.filter( f => {return f.token ===r.name }).forEach( row =>{
        row.outdated = true;
        row.outdatedData = r
        row.outdatedNewVer = r.current_version
      } )
    });


    this.brewCasksInfo.forEach(row => {
      row.ver = row.version
      if (row.auto_updates)  {row.ver = 'auto update'}  
    });

    this.brewLsFormulas.forEach(row => {
      row.ver = row.installed[0].version
      if (row.pinned) {
        row.ver = "📌 " + row.ver
      }
    });




  }
}