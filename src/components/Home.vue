<template>
  <b-container fluid>
    <p  v-if="isShowNavigation">
      <b-button size="sm" class="mr-1" @click="getInfo" v-bind:disabled="isGetInfoDisabled" >Refresh</b-button>
      <b-button size="sm" class="mr-1" @click="doUpgradeAll">Upgrade all ({{countUpgradable}})</b-button>
      <b-button size="sm" class="mr-1" @click="doDoctor">Doctor</b-button>
      <br />      
    </p>
    <b-alert show v-bind:variant="statusVariant" v-if="status !== 'Finished'" >
      {{ status }}
    </b-alert>
    <div  v-if="isShowNavigation">
      <a v-b-toggle.collapse-cask class="m-1" @click.prevent>
        <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
        Toggle Cask</a>      
      <b-collapse visible id="collapse-cask">
        <b-card>
          <b-row>
            <b-col lg="6" class="my-1">
              <b-form-group
                label="Filter"
                label-cols-sm="3"
                label-align-sm="left"
                label-size="sm"
                label-for="filterCask"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    v-model="filterCask"
                    type="search"
                    id="filterCask"
                    placeholder="Type to Search"
                    autofocus
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!filterCask" @click="filterCask = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-table
            :items="brewCasksInfo"
            :fields="brewCasksFields"
            sort-icon-left
            responsive="sm"
            :filter="filterCask"
            :filter-included-fields="['token', 'desc']"

            sortBy = 'outdatedNewVer'
            :sortDesc = true
          >
            <template #cell(actions)="row">
              <span @click="infoCask(row.item)" class="btn"> ℹ️ </span>
            </template>
          </b-table>

        </b-card>
      </b-collapse>
    </div>




    <div  v-if="isShowNavigation">
      <a v-b-toggle.collapse-formula class="m-1" @click.prevent>
        <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
        Toggle Formula</a>
      <b-collapse visible id="collapse-formula">
        <b-card>
          <b-row>
            <b-col lg="6" class="my-1">
              <b-form-group
                label="Filter"
                label-cols-sm="3"
                label-align-sm="left"
                label-size="sm"
                label-for="filterFormula"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    v-model="filterFormula"
                    type="search"
                    id="filterFormula"
                    placeholder="Type to Search"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!filterFormula" @click="filterFormula = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-table
            :items="brewLsFormulas"
            :fields="brewFormulasFields"
            sort-icon-left
            responsive="sm"
            :filter="filterFormula"
            :filter-included-fields="['name', 'desc']"

            sortBy = 'outdatedNewVer'
            :sortDesc = true
          >
            <template #cell(actions)="row">
              <span @click="infoFormula(row.item)" class="btn"> ℹ️ </span>
            </template>
          </b-table>

        </b-card>
      </b-collapse>
    </div>





  </b-container>
</template>

<script lang="ts">
import { computed, inject , ref } from "@vue/composition-api";
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
    
    const countUpgradable = computed(() => { 
      // eslint-disable-next-line
      return  brewCasksInfo.value.filter ( (row: any)=>{return row.outdated}).length + brewLsFormulas.value.filter ( (row: any)=>{return row.outdated}).length 
    })

    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    const isGetInfoDisabled = ref(false);

    const status = ref("Finished");
    const statusVariant = ref("info");
    
    const filterCask = ref("");
    const filterFormula = ref("");


    const brewCasksFields = [
      { key: "token", sortable: true },
      { key: "desc", sortable: true },
      { key: "ver", label: "Version", sortable: true },
      { key: "outdatedNewVer", label: "Outdated", sortable: true },
      { key: "actions", label: " " },
    ];

    const brewFormulasFields = [
      { key: "name", sortable: true },
      { key: "desc", sortable: true },
      { key: "ver", label: "Version", sortable: true },
      { key: "outdatedNewVer", label: "Outdated", sortable: true },
      { key: "actions", label: " " },
    ];

    async function doUpgradeAll(){ 
      const brewInfo = new BrewInfo();
      await brewInfo.doUpgradeAll(status); 
    }

    async function doDoctor(){   
      const brewInfo = new BrewInfo();
      await brewInfo.doDoctor(status); 
    }


    async function getInfo(doBrewUpdate = true) {
      try {
        store.commit("setIsShowNavigation", false)
        isGetInfoDisabled.value = true
        statusVariant.value = "info"
        const brewInfo = new BrewInfo();
        const data = await brewInfo.getInfo(status, doBrewUpdate);
        store.commit("setBrewCasksInfo", data.brewCasksInfo)
        store.commit("setBrewLsFormulas", data.brewLsFormulas)
      } catch (e) {
        statusVariant.value = "danger"
      }      
      finally {
        isGetInfoDisabled.value = false
        store.commit("setIsShowNavigation", true)
      }

    }

    if (store.state.isFirstOpened) {
      store.commit("setIsFirstOpened", false)
      getInfo(false);      
    }

    // eslint-disable-next-line
    function infoCask(r: any) {
      ctx.root.$router.push({path: `/info/${encodeURI( JSON.stringify( { searchType: "cask", searchName: r.token}))}` })
    }

    // eslint-disable-next-line
    function infoFormula(r: any) {
      ctx.root.$router.push({path: `/info/${encodeURI( JSON.stringify( { searchType: "formula", searchName: r.name}))}` })
    }

    return {
      getInfo,
      status,
      brewCasksInfo,
      brewLsFormulas,
      brewCasksFields,
      infoCask,
      filterCask,
      filterFormula,
      infoFormula,
      brewFormulasFields,
      doUpgradeAll,
      doDoctor,
      countUpgradable,
      isGetInfoDisabled,
      statusVariant,
      isShowNavigation,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
