<template>
  <b-container fluid>
    <b-form inline>
      <b-form-select
        id="inline-form-custom-select-pref"
        class="mb-2 mr-sm-2 mb-sm-0"
        :options="['cask', 'formula']"
        v-model="searchType"
      ></b-form-select>

      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="name"
        v-model="searchName"
      ></b-form-input>
      <b-button variant="primary" @click="getPackageInfo()">Info</b-button>
    </b-form>
    <b-alert show variant="info" v-if="status !== 'Finished'" >
      {{ status }}
    </b-alert>
    <pre>{{ packageInfo }}         
<span v-if="isShowUsedIn"> Used in: {{usedIn}}</span>       
  </pre>
 <p>
      <b-button size="sm" class="mr-1"  v-if="isShowPin" @click="doPin">Pin</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowUnpin" @click="doUnpin">Unpin</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowUpgrade" @click="doUpgrade">Upgrade</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowInstall" @click="doInstall">Install</b-button>
      <b-button size="sm" class="mr-1"  v-if="isInstalled" @click="doUninstall">Uninstall</b-button>
</p>      


  </b-container>
</template>

<script lang="ts">
import { ref, Ref, computed, inject } from "@vue/composition-api";
import { PackageType } from "../src/BrewInfo";
import { PackageInfo } from "../src/PackageInfo";

export default {
  /* eslint-disable */
  setup(prop: any, ctx: any) {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const brewCasksInfo = computed(() => store.state.brewCasksInfo);
    // eslint-disable-next-line
    const brewLsFormulas = computed(() => store.state.brewLsFormulas);

    const searchType = ref("cask");
    const searchName = ref("");
    

    const packageInfo = ref("");
    const status = ref("Finished");
    const usedIn: Ref<string[]> = ref([]);
    
    const isShowUsedIn = ref(false);
    const isShowPin = ref(false);
    const isShowUnpin = ref(false);
    const isShowUpgrade = ref(false);
    const isShowInstall = ref(false);
    const isInstalled = ref(false);



    let packageInfoObj: PackageInfo;

    function resetForm(){
      packageInfo.value = ""      
      usedIn.value = []

      isShowUsedIn.value = false
      isShowPin.value = false
      isShowUnpin.value = false
      isShowUpgrade.value = false
      isShowInstall.value = false
      isInstalled.value = false
    }


    function doUpgrade(){
      resetForm();
      return packageInfoObj.doUpgrade(status)
    }

    async function doUninstall(){
      resetForm();
      await packageInfoObj.doUninstall(status)
      store.commit("setBrewCasksInfo", [])
      store.commit("setBrewLsFormulas", [])
    }

    async function doInstall(){
      resetForm();
      await packageInfoObj.doInstall(status)
      store.commit("setBrewCasksInfo", [])
      store.commit("setBrewLsFormulas", [])      
    }

    function doPin() {
      resetForm()
      return packageInfoObj.doPin(status)
    }



    function doUnpin() {
      resetForm()
      return packageInfoObj.doUnpin(status)
    }

    async function getPackageInfo() {
      resetForm()


      if (searchName.value === "") {
        return;
      }
      packageInfoObj = new PackageInfo(brewCasksInfo.value, brewLsFormulas.value);
      let packageType = PackageType.formula;
      if (searchType.value === "cask") {
        packageType = PackageType.cask;
      }
      await packageInfoObj.getPackageInfo(
        packageType,
        searchName.value,
        status
      );

      packageInfo.value = packageInfoObj.packageInfoPreTxt      
      usedIn.value = packageInfoObj.usedIn

      isShowUsedIn.value = packageInfoObj.isShowUsedIn
      isShowPin.value = packageInfoObj.isShowPin
      isShowUnpin.value = packageInfoObj.isShowUnpin
      isShowUpgrade.value = packageInfoObj.isShowUpgrade
      isShowInstall.value = packageInfoObj.isShowInstall
      isInstalled.value = packageInfoObj.isInstalled
      

    }


    if (ctx.root.$route.params.p) {
      const uri = JSON.parse( decodeURI( ctx.root.$route.params.p) )
      searchType.value = uri.searchType;
      searchName.value = uri.searchName;
      getPackageInfo();
    }

    return { searchType, packageInfo, searchName, status, getPackageInfo, isShowUsedIn, usedIn, 
          isShowPin, isShowUnpin, isShowUpgrade, isShowInstall, isInstalled,
          doPin, doUnpin, doUpgrade, doUninstall, doInstall };
  },
};
</script>