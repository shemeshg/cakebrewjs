<template>
  <b-container fluid>
    <p>
      <b-button size="sm" class="mr-1" @click="getInfo"
        >getInfo</b-button
      >
      <b-button size="sm" class="mr-1">Upgrade all</b-button>

      <br />
      {{ status }}
    </p>

    <div>
      <b-button v-b-toggle.collapse-cask class="m-1">Toggle Cask</b-button>
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
          >
            <template #cell(actions)="row">
              <span @click="infoCask(row.item)" class="btn"> ℹ️ </span>
            </template>
          </b-table>

        </b-card>
      </b-collapse>
    </div>




    <div>
      <b-button v-b-toggle.collapse-formula class="m-1">Toggle Formula</b-button>
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
            :filter-included-fields="['name', 'description']"
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
import { ref, Ref } from "@vue/composition-api";
import { BrewInfo } from "../src/BrewInfo";

export default {
  setup() {
    const brewInfo = new BrewInfo();
    const status = ref("");

    
    const filterCask = ref("");
    const filterFormula = ref("");
    // eslint-disable-next-line
    const brewCasksInfo: Ref<any[]> = ref([]);
    // eslint-disable-next-line
    const brewLsFormulas: Ref<any[]> = ref([]);

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

    async function getInfo() {
      const data = await brewInfo.getInfo(status);
      brewCasksInfo.value = data.brewCasksInfo;
      brewLsFormulas.value = data.brewLsFormulas;
    }



    // eslint-disable-next-line
    function infoCask(r: any) {
      console.log(r);
    }

    // eslint-disable-next-line
    function infoFormula(r: any) {
      console.log(r);
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
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
