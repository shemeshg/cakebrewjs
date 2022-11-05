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
      <b-button variant="primary" class="mr-1" @click="getPackageInfo()"
        >Search</b-button
      >
    </b-form>
    <b-alert show v-bind:variant="statusVariant" v-if="status !== 'Finished'">
      <div v-html="status"></div>
    </b-alert>
    <a class="m-1"  v-if="caskList.length > 0" @click="toggleCaskVisible"><b-icon icon="arrows-collapse" aria-hidden="true"></b-icon> Cask</a>
    <ul v-if="caskVisible">
      <li v-for="(item, idx) in caskList" v-bind:key="idx">{{item.name}}(<a 
              href="#"
              class="m-1"               
              @click="redirectInfo(item.token, 'cask')" >
              {{item.token}}
              </a>) {{item.version}} <span style="color: green" v-if="item.installed">installed</span>
        -        
        <a 
              href="#"
              class="m-1"               
              @click="openUrl(item.homepage)" >
              {{item.homepage}}
        </a><br/>
        {{item.desc}}
      </li>
    </ul>
    <br/>
    <a class="m-1" v-if="formulaList.length > 0" @click="toggleFormulaVisible"><b-icon icon="arrows-collapse" aria-hidden="true"></b-icon> Formula</a>
    <ul v-if="formulaVisible">
      <li v-for="(item, idx) in formulaList" v-bind:key="idx">{{item.name}}(<a 
              href="#"
              class="m-1"               
              @click="redirectInfo(item.token, 'formula')" >
              {{item.token}}
              </a>) {{item.version}} <span style="color: green" v-if="item.installed">installed</span>
        -        
        <a 
              href="#"
              class="m-1"               
              @click="openUrl(item.homepage)" >
              {{item.homepage}}
        </a><br/>
        {{item.desc}}
      </li>
    </ul>    

  </b-container>
</template>


<script lang="ts">
import { ref, computed, inject } from "@vue/composition-api";
import { BrewInfo } from "../src/BrewInfo";



export default {
/* eslint-disable */
    setup(prop: any, ctx: any) {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");

    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    // eslint-disable-next-line
    const status = computed({
      get: () => store.state.statusInfo,
      set: (val) => {
        store.commit("setStatusInfo", val);
      },
    });
    const statusVariant = computed({
      get: () => store.state.statusVariantInfo,
      set: (val) => {
        store.commit("setStatusVariantInfo", val);
      },
    });

    const searchName = ref("");

    
    const caskList = ref([]);
    const formulaList = ref([]);

    const caskVisible = ref(true);
    const formulaVisible = ref(true);

    const toggleCaskVisible=()=>{
      caskVisible.value = !caskVisible.value
    }
    const toggleFormulaVisible=()=>{
      formulaVisible.value = !formulaVisible.value
    }


    function resetForm() {
      statusVariant.value = "info";
      caskList.value = [];
      formulaList.value = [];      
    }

    const parseCask = (s: string) => {
      const json = JSON.parse(s);
      const rows = json.casks.map((row: any) => {
        return {
          token: row.token,
          name: row.name[0],
          version: row.version,
          homepage: row.homepage,
          installed: row.installed,
          desc: row.desc,
        };
      });
      return rows;
    };

    const parseFormula = (s: string) => {
      const json = JSON.parse(s);
      const rows = json.formulae.map((row: any) => {
        return {
          token: row.name,
          name: row.full_name,
          version: row.versions.stable,
          homepage: row.homepage,
          installed: row.installed.length,
          desc: row.desc,
        };
      });
      return rows;
    };

    const redirectInfo= (name: string, searchType: "formula"|"cask") =>{
      ctx.root.$router.push({
        path: `/info/${encodeURI(
          JSON.stringify({ searchType: searchType, searchName: name })
        )}`,
      });
    }

    const openUrl = (s: string)=>{
      const { shell } = require("electron");
      shell.openExternal(s);
    }

    const getPackageInfo = async () => {
      resetForm();
      store.commit("setIsShowNavigation", false);
      if (!searchName.value) {
        return;
      }
      const brewInfo = new BrewInfo();
      try {
        const ret = await brewInfo.getSearch(searchName.value, status);
        caskList.value = parseCask(ret.caskResult);
        formulaList.value = parseFormula(ret.formulaResult)
      } catch (e) {
        statusVariant.value = "danger";
        throw e;
      }
      store.commit("setIsShowNavigation", true);
    };
    return {
      isShowNavigation,
      searchName,
      getPackageInfo,
      resetForm,
      status,
      statusVariant,
      caskList,
      redirectInfo,
      openUrl,
      formulaList,
      toggleCaskVisible,
      toggleFormulaVisible,
      caskVisible,
      formulaVisible

    };
  },
};
</script>