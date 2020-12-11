import { Ref } from "@vue/composition-api";
import {BrewInfo, PackageType} from "./BrewInfo"

export class PackageInfo {
    // eslint-disable-next-line
    private brewCasksInfo: any[];
    // eslint-disable-next-line
    private brewLsFormulas: any[]

    packageInfoPreTxt = ""
    isFormula = false
    // eslint-disable-next-line
    localSearchItem: any[] = [];

    // eslint-disable-next-line
    constructor(brewCasksInfo: any[], brewLsFormulas: any[]){
      this.brewCasksInfo = brewCasksInfo;
      this.brewLsFormulas = brewLsFormulas;
    }

    async getPackageInfo(packageType: PackageType, packageName: string, status: Ref){
      this.isFormula = packageType === PackageType.formula;
      const brewInfo = new BrewInfo();
      this.packageInfoPreTxt = await brewInfo.getPackageInfo(
        packageType,
        packageName,
        status
      );
      debugger;
      if (packageType === PackageType.formula){
        this.localSearchItem = this.brewLsFormulas.filter( (row)=>{ return row.name === packageName})
      } else {
        this.localSearchItem = this.brewCasksInfo.filter( (row)=>{ return row.token === packageName})
      }
      
      return;

    }

    get isInstalled(){
      return this.localSearchItem.length > 0
    }
}