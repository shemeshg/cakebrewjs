<template>
  <b-container fluid>
    <b-form @submit.stop.prevent inline v-if="isShowNavigation">
      <b-form-input
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="name"
        v-model="searchName"
        autofocus
        @keydown.enter.native="getPackageInfo()"
      ></b-form-input>
      <b-button variant="primary" class="mr-1" @click="getPackageInfo()">Search</b-button>

    </b-form>
    <b-alert show v-bind:variant="statusVariant" v-if="status !== 'Finished'" >
        <div  v-html="status"> </div>
    </b-alert>
    <pre>{{ searchInfo }}</pre>
  </b-container>
</template>


<script lang="ts">
import { ref, computed, inject } from "@vue/composition-api";
import { BrewInfo } from "../src/BrewInfo";

export default {
  setup() {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");

    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    // eslint-disable-next-line
    const status = computed({get: () => store.state.statusInfo, set: (val)=>{
      store.commit("setStatusInfo", val);
    }});
    const statusVariant = computed({get: () => store.state.statusVariantInfo, set: (val)=>{
      store.commit("setStatusVariantInfo", val);
    }});

    const searchName = ref("");
    const searchInfo = ref("");

    
    function resetForm(){
      statusVariant.value = "info";
      searchInfo.value = "";
    }


    const  getPackageInfo = async () => {
      resetForm();
      if (!searchName.value){return;}
      const brewInfo = new BrewInfo();
      try {
        searchInfo.value = await brewInfo.getSearch( searchName.value, status);
      } catch (e) {
        statusVariant.value = "danger";
        throw e
      }
      

    }
    return {isShowNavigation, searchName, getPackageInfo, resetForm, status, statusVariant, searchInfo};
  },
};
</script>