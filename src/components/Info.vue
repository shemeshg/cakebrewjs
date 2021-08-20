<template>
  <b-container fluid>
    <b-form @submit.stop.prevent inline v-if="isShowNavigation">
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
        autofocus
        @keydown.enter.native="getPackageInfo()"
      ></b-form-input>
      <b-button variant="primary" @click="getPackageInfo()">Info</b-button>
    </b-form>
    <b-alert show v-bind:variant="statusVariant" v-if="status !== 'Finished'" >
        <div  v-html="status"> </div>
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
      <b-button size="sm" class="mr-1"  v-if="isInstalledZap" @click="doUninstall(true)">Uninstall zap</b-button>
</p>      


  </b-container>
</template>

<script lang="ts">
import { ref, Ref, computed, inject } from "@vue/composition-api";
import { PackageType } from "../src/BrewInfo";
import { PackageInfo } from "../src/PackageInfo";
import { BrewInfo } from "../src/BrewInfo";

export default {
  /* eslint-disable */
  setup(prop: any, ctx: any) {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const brewCasksInfo = computed(() => store.state.brewCasksInfo);
    // eslint-disable-next-line
    const brewLsFormulas = computed(() => store.state.brewLsFormulas);

    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    const searchType = ref("cask");
    const searchName = ref("");
    

    const packageInfo = ref("");
    
    // eslint-disable-next-line
    const status = computed({get: () => store.state.statusInfo, set: (val)=>{
      store.commit("setStatusInfo", val);
    }});
    const statusVariant = computed({get: () => store.state.statusVariantInfo, set: (val)=>{
      store.commit("setStatusVariantInfo", val);
    }});
    
    const usedIn: Ref<string[]> = ref([]);
    
    const isShowUsedIn = ref(false);
    const isShowPin = ref(false);
    const isShowUnpin = ref(false);
    const isShowUpgrade = ref(false);
    const isShowInstall = ref(false);
    const isInstalled = ref(false);
    const isInstalledZap = ref(false);


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
      isInstalledZap.value = false
      statusVariant.value = "info";
    }


    async function doUpgrade(){
      resetForm();
      store.commit("setIsShowNavigation", false);
      await packageInfoObj.doUpgrade(status)      
      const brewInfo = new BrewInfo();
      await brewInfo.getInfoToStore(status, false, store);
      store.commit("setIsShowNavigation", true);
    }

    async function doUninstall(zap = false){
      resetForm();
      store.commit("setIsShowNavigation", false);
      await packageInfoObj.doUninstall(status, zap)         
      const brewInfo = new BrewInfo();
      await brewInfo.getInfoToStore(status, false, store);         
      store.commit("setIsShowNavigation", true);
    }

    async function doInstall(){
      resetForm();
      store.commit("setIsShowNavigation", false);
      await packageInfoObj.doInstall(status)      
      const brewInfo = new BrewInfo();
      await brewInfo.getInfoToStore(status, false, store);
      store.commit("setIsShowNavigation", true);
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
      let s: string = searchName.value
      s = s.trim()
      const sary = s.split(" ")
      searchName.value = sary[sary.length -1]

      if (searchName.value === "") {
        return;
      }
      packageInfoObj = new PackageInfo(brewCasksInfo.value, brewLsFormulas.value);
      let packageType = PackageType.formula;
      if (searchType.value === "cask") {
        packageType = PackageType.cask;
      }

      try {
        await packageInfoObj.getPackageInfo(
          packageType,
          searchName.value,
          status
        );
      } catch (e) {
        statusVariant.value = "danger";
        throw e
      }
      packageInfo.value = packageInfoObj.packageInfoPreTxt      
      usedIn.value = packageInfoObj.usedIn

      isShowUsedIn.value = packageInfoObj.isShowUsedIn
      isShowPin.value = packageInfoObj.isShowPin
      isShowUnpin.value = packageInfoObj.isShowUnpin
      isShowUpgrade.value = packageInfoObj.isShowUpgrade
      isShowInstall.value = packageInfoObj.isShowInstall
      isInstalled.value = packageInfoObj.isInstalled
      isInstalledZap.value = packageInfoObj.isInstalledZap

    }


    if (ctx.root.$route.params.p) {
      const uri = JSON.parse( decodeURI( ctx.root.$route.params.p) )
      searchType.value = uri.searchType;
      searchName.value = uri.searchName;
      getPackageInfo();
    }

    return { searchType, packageInfo, searchName, status, getPackageInfo, isShowUsedIn, usedIn, 
          isShowPin, isShowUnpin, isShowUpgrade, isShowInstall, isInstalled,isInstalledZap,
          doPin, doUnpin, doUpgrade, doUninstall, doInstall, statusVariant, isShowNavigation };
  },
};
</script>