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
  </pre
    >
  </div>
</template>

<script lang="ts">
import { ref } from "@vue/composition-api";
import { BrewInfo, PackageType } from "../src/BrewInfo";

export default {
  setup() {
    const searchType = ref("cask");
    const searchName = ref("");
    const packageInfo = ref("");
    const status = ref("");

    //isFormula
    //isInstalled
    //isPinned
    //usePackages
    //usedByPackages


    async function getPackageInfo() {
      if (searchName.value === "") {
        return;
      }
      const brewInfo = new BrewInfo();
      let packageType = PackageType.formula;
      if (searchType.value === "cask") {
        packageType = PackageType.cask;
      }
      packageInfo.value = await brewInfo.getPackageInfo(
        packageType,
        searchName.value,
        status
      );
    }

    return { searchType, packageInfo, searchName, status, getPackageInfo };
  },
};
</script>