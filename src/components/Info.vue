<template>
  <div>
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
    <p>
      {{ status }}
    </p>
    <pre
      >{{ packageInfo }}    
  </pre>
  <p> is installed: {{isInstalled}} </p>
  </div>
</template>

<script lang="ts">
import { ref, computed, inject } from "@vue/composition-api";
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
    
    const isInstalled = ref(false);
    //packageInfoPreTxt
    //isFormula
    //isInstalled
    //isPinned
    //isOutdated
    //usePackages
    //usedByPackages


    async function getPackageInfo() {
      if (searchName.value === "") {
        return;
      }
      const packageInfoObj = new PackageInfo(brewCasksInfo.value, brewLsFormulas.value);
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
      isInstalled.value = packageInfoObj.isInstalled
    }

    return { searchType, packageInfo, searchName, status, getPackageInfo, isInstalled };
  },
};
</script>