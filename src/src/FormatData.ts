class BrewServicesI {
  name = "";
  status = "";
  user = "";
  plist = "";
}

export class FormatData {
  // eslint-disable-next-line
  brewCasksInfo: any[];
  // eslint-disable-next-line
  brewLsFormulas: any[];

  brewServices: BrewServicesI[]
  
  private parseBreServices( s: string){
    const lines = JSON.parse(s)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret: BrewServicesI[] = lines.map((row: any)=>{
      const i = new BrewServicesI();
      i.name = row.name;
      i.status = row.status;
      i.user = row.user
      i.plist = row.file
      return i
      })
   
    return ret
  }

  constructor ( brewLs: string , brewOutdatedStr: string, brewServices: string){
    this.brewServices = this.parseBreServices( brewServices )
    
    const json = JSON.parse( brewLs )

    this.brewCasksInfo = json.casks
    this.brewLsFormulas = json.formulae
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
        row.version = r.installed_versions
      } )
    });


    this.brewCasksInfo.forEach(row => {
      row.ver = row.version
      if (row.auto_updates)  {row.ver = 'auto update'}  
    });

    this.brewLsFormulas.forEach(row => {
      const packageName = row.name
      row.usedIn = this.brewLsFormulas.filter( (row)=>{ return row.dependencies.indexOf(packageName) > -1 || row.build_dependencies.indexOf(packageName) > -1}).map( (row)=>{return row.name} )
      row.isLeaf = row.usedIn.length === 0
      row.ver = row.installed[0].version
      row.installedOnRequest = !row.isLeaf && row.installed[0].installed_on_request
      row.isLeafSortOrder = 2;
      if (row.isLeaf) {row.isLeafSortOrder = 0} else if (row.installedOnRequest){row.isLeafSortOrder = 1}

      if (row.pinned) {
        row.ver = "📌 " + row.ver
      }
    });


  }
}