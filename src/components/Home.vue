<template>
  <b-container fluid>
    <p v-if="isShowNavigation">
      <b-button
        size="sm"
        class="mr-1"
        @click="getInfo"
        v-bind:disabled="isGetInfoDisabled"
        >Refresh</b-button
      >
      <b-button size="sm" class="mr-1" @click="doUpgradeAll"
        >Upgrade all ({{ countUpgradable }})</b-button
      >

      <b-button size="sm" class="mr-1" @click="doUpgradeSelected"
        >Upgrade selected ({{
          formulaSelectedUpgrade.length + caskSelectedUpgrade.length
        }})</b-button
      >

      <b-button size="sm" class="mr-1" @click="doDoctor">Doctor</b-button>
      <br />
    </p>
    <b-alert show v-bind:variant="statusVariant" v-if="status !== 'Finished'">
      <div  v-html="status"> </div>   
    </b-alert>
    <div v-if="isShowNavigation">
      <a class="m-1" @click="toggleCaskVisible()">
        <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
        Toggle Cask ({{
          brewCasksInfo.filter((row) => {
            return row.outdated;
          }).length
        }})</a
      >
      <b-collapse v-bind:visible="caskVisible" id="collapse-cask">
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
            sortBy="outdatedNewVer"
            :sortDesc="true"
          >
            <template #cell(outdatedNewVer)="row">
              <b-form-checkbox
                v-if="row.item.outdatedNewVer"
                v-model="row.item.selectedUpgrade"
              >
                {{ row.item.outdatedNewVer }}
              </b-form-checkbox>
            </template>

            <template #cell(actions)="row">
              <span @click="infoCask(row.item)" class="btn"> ℹ️ </span>
            </template>
          </b-table>
        </b-card>
      </b-collapse>
    </div>

    <div v-if="isShowNavigation">
      <a class="m-1" @click="toggleFormulaVisible">
        <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
        Toggle Formula ({{
          brewLsFormulas.filter((row) => {
            return row.outdated;
          }).length
        }})</a
      >
      <b-collapse v-bind:visible="formulaVisible" id="collapse-formula">
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
                    <b-button
                      :disabled="!filterFormula"
                      @click="filterFormula = ''"
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
            sortBy="outdatedNewVer"
            :sortDesc="true"
          >
            <template #cell(outdatedNewVer)="row">
              <b-form-checkbox
                v-if="row.item.outdatedNewVer"
                v-model="row.item.selectedUpgrade"
              >
                {{ row.item.outdatedNewVer }}
              </b-form-checkbox>
            </template>

            <template #cell(actions)="row">
              <span @click="infoFormula(row.item)" class="btn"> ℹ️ </span>
            </template>
          </b-table>
        </b-card>
      </b-collapse>
    </div>
    <div v-if="isShowNavigation">
      <a class="m-1"  @click="toggleServicesVisible">
        <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
        Toggle Services</a
      >
      <b-collapse v-bind:visible="servicesVisible" id="collapse-services">
        <b-card>
          <b-row>
            <b-col lg="6" class="my-1">
              <b-form-group
                label="Filter"
                label-cols-sm="3"
                label-align-sm="left"
                label-size="sm"
                label-for="filterServices"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    v-model="filterServices"
                    type="search"
                    id="filterServices"
                    placeholder="Type to Search"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button
                      :disabled="!filterServices"
                      @click="filterServices = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-table
            :items="brewServices"
            :fields="brewServicesFields"
            sort-icon-left
            responsive="sm"
            :filter="filterServices"
            :sortDesc="true"
          >


            <template #cell(actions)="row">
              
              <a class="m-1" 
              v-if="row.item.status === 'stopped'"
              @click="startService(row.item.name)" >
                 Start {{row.item.name}}
              </a>
              <a class="m-1" 
              v-if="row.item.status !== 'stopped'"
              @click="stopService(row.item.name)"> 
                 Stop {{row.item.name}}
              </a>              
            </template>
          </b-table>
        </b-card>
      </b-collapse>
    </div>
  </b-container>
</template>

<script lang="ts">
import { computed, inject, ref, Ref } from "@vue/composition-api";
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
    const brewServices = computed(() => store.state.brewServices);

    const _getBoolLocalStorage = (key: string) => {
      const i = localStorage.getItem(key);
      if (i === null) {
        return false;
      }
      return Boolean(JSON.parse(i));
    };

    const _toggleBoolLocalStorage = (key: string, r: Ref<boolean>) =>{
      const s = !r.value;
      const b = JSON.stringify(s);
      localStorage.setItem(key, b);
      r.value = s;
    }

    const caskVisible = ref(_getBoolLocalStorage("caskVisible"));
    const toggleCaskVisible = () => {
      _toggleBoolLocalStorage("caskVisible", caskVisible)
    };

    const formulaVisible = ref(_getBoolLocalStorage("formulaVisible"));
    const toggleFormulaVisible = () => {
      _toggleBoolLocalStorage("formulaVisible", formulaVisible)
    };


    const servicesVisible = ref(_getBoolLocalStorage("servicesVisible"));
    const toggleServicesVisible = () => {
      _toggleBoolLocalStorage("servicesVisible", servicesVisible)
    };

    const formulaSelectedUpgrade = computed(() =>
      brewLsFormulas.value.filter((row: any) => {
        return row.selectedUpgrade;
      })
    );
    const caskSelectedUpgrade = computed(() =>
      brewCasksInfo.value.filter((row: any) => {
        return row.selectedUpgrade;
      })
    );

    const countUpgradable = computed(() => {
      // eslint-disable-next-line
      return (
        brewCasksInfo.value.filter((row: any) => {
          return row.outdated;
        }).length +
        brewLsFormulas.value.filter((row: any) => {
          return row.outdated;
        }).length
      );
    });

    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    const isGetInfoDisabled = ref(false);

    const status = ref("Finished");
    const statusVariant = ref("info");

    const filterCask = ref("");
    const filterFormula = ref("");
    const filterServices = ref("");

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

    const brewServicesFields = [
      { key: "name", sortable: true },
      { key: "status", sortable: true },
      { key: "user", sortable: true },
      { key: "plist", sortable: true },
      { key: "actions", label: " " },
    ];

    async function doUpgradeAll() {
      const brewInfo = new BrewInfo();
      await brewInfo.doUpgradeAll(status);
      getInfo(false);
    }

    async function doUpgradeSelected() {
      const formulas = formulaSelectedUpgrade.value.map((row: any) => {
        return row.name;
      });
      const casks = caskSelectedUpgrade.value.map((row: any) => {
        return row.token;
      });
      const brewInfo = new BrewInfo();
      await brewInfo.doUpgradeSelected(formulas, casks, status);
      getInfo(false);
    }

    async function doDoctor() {
      const brewInfo = new BrewInfo();
      await brewInfo.doDoctor(status);
    }

    async function startService(name: string){
      const brewInfo = new BrewInfo();
      await brewInfo.startService(name, status);
      getInfo(false);
    }

    async function stopService(name: string){
      const brewInfo = new BrewInfo();
      await brewInfo.stopService(name, status);
      getInfo(false);
    }

    async function getInfo(doBrewUpdate = true) {
      try {
        store.commit("setIsShowNavigation", false);
        isGetInfoDisabled.value = true;
        statusVariant.value = "info";
        const brewInfo = new BrewInfo();
        const data = await brewInfo.getInfo(status, doBrewUpdate);
        store.commit("setBrewCasksInfo", data.brewCasksInfo);
        store.commit("setBrewLsFormulas", data.brewLsFormulas);
        store.commit("setBrewServices", data.brewServices);

      } catch (e) {
        statusVariant.value = "danger";
      } finally {
        isGetInfoDisabled.value = false;
        store.commit("setIsShowNavigation", true);
      }
    }

    if (store.state.isFirstOpened) {
      store.commit("setIsFirstOpened", false);
      getInfo(false);
    }

    // eslint-disable-next-line
    function infoCask(r: any) {
      ctx.root.$router.push({
        path: `/info/${encodeURI(
          JSON.stringify({ searchType: "cask", searchName: r.token })
        )}`,
      });
    }

    // eslint-disable-next-line
    function infoFormula(r: any) {
      ctx.root.$router.push({
        path: `/info/${encodeURI(
          JSON.stringify({ searchType: "formula", searchName: r.name })
        )}`,
      });
    }

    return {
      getInfo,
      status,
      brewCasksInfo,
      brewLsFormulas,
      brewCasksFields,
      brewServices,
      infoCask,
      filterCask,
      filterFormula,
      filterServices,
      infoFormula,
      brewFormulasFields,
      doUpgradeAll,
      doDoctor,
      countUpgradable,
      isGetInfoDisabled,
      statusVariant,
      isShowNavigation,
      formulaSelectedUpgrade,
      caskSelectedUpgrade,
      doUpgradeSelected,
      caskVisible,
      toggleCaskVisible,
      formulaVisible,
      toggleFormulaVisible,
      servicesVisible,
      toggleServicesVisible,
      brewServicesFields,
      startService,
      stopService,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
