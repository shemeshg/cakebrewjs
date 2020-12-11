<template>
  <div class="hello">
    <p>
      <b-button size="sm" class="mr-1" @click="getInfo">getInfol</b-button>
      <b-button size="sm" class="mr-1">Upgrade all</b-button>



      <br />
      {{ status }}
    </p>
    <b-table
      :items="brewCasksInfo"
      :fields="brewCasksFields"
      sort-icon-left
      responsive="sm"
    >
      <template #cell(actions)="row">
        <span  @click="info(row.item)" class="btn">
          ℹ️
        </span>
      </template>
    
    </b-table>    

  </div>
</template>

<script lang="ts">
import { ref, Ref } from '@vue/composition-api'
import { BrewInfo } from "../src/BrewInfo";

export default {
  setup() {
    const brewInfo = new BrewInfo()
    const status = ref("")
    // eslint-disable-next-line 
    const brewCasksInfo: Ref<any[]> = ref([])
    // eslint-disable-next-line 
    const brewLsFormulas: Ref<any[]>  = ref([])

    const brewCasksFields = [
          { key: 'token', sortable: true },
          { key: 'desc', sortable: true },
          { key: 'ver', label: 'Version', sortable: true },
          { key: 'outdatedNewVer', label: 'Outdated', sortable: true },
          { key: 'actions', label: ' ' }
          



        ]

    async function getInfo(){      
      const data = await brewInfo.getInfo(status);
      brewCasksInfo.value = data.brewCasksInfo
      brewLsFormulas.value =  data.brewLsFormulas
    }

    // eslint-disable-next-line
    function info(r: any){
      console.log(r)
    }

    return {  getInfo, status, brewCasksInfo, 
      brewLsFormulas, brewCasksFields, info }; 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
