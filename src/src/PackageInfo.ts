import { Ref } from "@vue/composition-api";
import {BrewInfo, PackageType} from "./BrewInfo"

export class PackageInfo {
    // eslint-disable-next-line
    private brewCasksInfo: any[];
    // eslint-disable-next-line
    private brewLsFormulas: any[]

    packageInfoPreTxt = ""
    packageType: PackageType = PackageType.formula
    packageName = ""
    usedIn: string[] = []
    
    // eslint-disable-next-line
    localSearchItem: any[] = [];

    // eslint-disable-next-line
    constructor(brewCasksInfo: any[], brewLsFormulas: any[]){
      this.brewCasksInfo = brewCasksInfo;
      this.brewLsFormulas = brewLsFormulas;
    }

    async getPackageInfo(packageType: PackageType, packageName: string, status: Ref){
      this.packageType = packageType;
      this.packageName = packageName;
      const brewInfo = new BrewInfo();
      this.packageInfoPreTxt = await brewInfo.getPackageInfo(
        packageType,
        packageName,
        status
      );
      debugger;
      if (packageType === PackageType.formula){
        this.localSearchItem = this.brewLsFormulas.filter( (row)=>{ return row.name === packageName})
        this.usedIn = this.brewLsFormulas.filter( (row)=>{ return row.dependencies.indexOf(packageName) > -1 || row.build_dependencies.indexOf(packageName) > -1}).map( (row)=>{return row.name} )
      } else {
        this.localSearchItem = this.brewCasksInfo.filter( (row)=>{ return row.token === packageName})
      }
      debugger;
      return;

    }

    get isInstalled(){
      return this.localSearchItem.length > 0
    }
}