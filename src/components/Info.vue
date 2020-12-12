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
    <p v-if="status !== 'Finished'" >
      {{ status }}
    </p>
    <pre>{{ packageInfo }}         
<span v-if="isShowUsedIn"> Used in: {{usedIn}}</span>       
  </pre>
 <p>
      <b-button size="sm" class="mr-1"  v-if="isShowPin">Pin</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowUnpin">Unpin</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowUpgrade">Upgrade</b-button>
      <b-button size="sm" class="mr-1"  v-if="isShowInstall">Install</b-button>
      <b-button size="sm" class="mr-1"  v-if="isInstalled">Uninstall</b-button>
</p>      


  </b-container>
</template>

<script lang="ts">
import { ref, Ref, computed, inject } from "@vue/composition-api";
import { PackageType } from "../src/BrewInfo";
import { PackageInfo } from "../src/PackageInfo";

export default {
  setup() {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const brewCasksInfo = computed(() => store.state.brewCasksInfo);
    // eslint-disable-next-line
    const brewLsFormulas = computed(() => store.state.brewLsFormulas);

    const searchType = ref("cask");
    const searchName = ref("");
    const packageInfo = ref("");
    const status = ref("");
    const usedIn: Ref<string[]> = ref([]);
    
    const isShowUsedIn = ref(false);
    const isShowPin = ref(false);
    const isShowUnpin = ref(false);
    const isShowUpgrade = ref(false);
    const isShowInstall = ref(false);
    const isInstalled = ref(false);

    let packageInfoObj: PackageInfo;

    async function getPackageInfo() {
      packageInfo.value = ""      
      usedIn.value = []

      isShowUsedIn.value = false
      isShowPin.value = false
      isShowUnpin.value = false
      isShowUpgrade.value = false
      isShowInstall.value = false
      isInstalled.value = false

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
      
      debugger; 
    }

    return { searchType, packageInfo, searchName, status, getPackageInfo, isShowUsedIn, usedIn, 
          isShowPin, isShowUnpin, isShowUpgrade, isShowInstall, isInstalled };
  },
};
</script>