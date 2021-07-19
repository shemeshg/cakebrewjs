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

    async doPin(status: Ref){
      const brewInfo = new BrewInfo();
      await brewInfo.doPin(
        this.packageName,
        status
      );
      this.localSearchItem[0].pinned = true;
    }

    async doUnpin(status: Ref){
      const brewInfo = new BrewInfo();
      await brewInfo.doUnpin(
        this.packageName,
        status
      );
      this.localSearchItem[0].pinned = false;
    }

    async doUpgrade(status: Ref){
      const brewInfo = new BrewInfo();
      await brewInfo.doUpgrade(
        this.packageType,
        this.packageName,
        status
      );
    }

    async doUninstall(status: Ref){
      const brewInfo = new BrewInfo();
      await brewInfo.doUninstall(
        this.packageType,
        this.packageName,
        status
      );
    }

    async doInstall(status: Ref){
      const brewInfo = new BrewInfo();
      await brewInfo.doInstall(
        this.packageType,
        this.packageName,
        status
      );
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

      if (packageType === PackageType.formula){
        this.localSearchItem = this.brewLsFormulas.filter( (row)=>{ return row.name === packageName})
        this.usedIn = []
        if (this.localSearchItem.length > 0){
          this.usedIn = this.localSearchItem[0].usedIn
        }
        
      } else {
        this.localSearchItem = this.brewCasksInfo.filter( (row)=>{ return row.token === packageName})

        if (this.localSearchItem.length > 0) {
          this.packageInfoPreTxt = this.packageInfoPreTxt + await brewInfo.getCaskTrashSizeReport(this.localSearchItem, status)          
        }
        
      }

      return;

    }

    get isFormuls() {
      return this.packageType  === PackageType.formula
    }

    get isShowInstall(){
      return Boolean( this.packageInfoPreTxt ) && !this.isInstalled
    }

    get isShowUsedIn(){
      return this.isInstalled && this.isFormuls
    }

    get isShowUpgrade(){
      return this.isInstalled && this.localSearchItem[0].outdated && !this.isShowUnpin
    }

    get isShowPin(){
      return this.isFormuls && this.isInstalled && !this.localSearchItem[0].pinned
    }

    get isShowUnpin(){
      return this.isFormuls && this.isInstalled && this.localSearchItem[0].pinned
    }

    get isInstalled(){
      return this.localSearchItem.length > 0
    }
}