<template>
  <div class="hello">
    <p>
      <button v-on:click="getInfo">getInfo</button>
      <br />
      {{ status }}
    </p>
    <b-table
      :items="brewCasksInfo"
      :fields="brewCasksFields"
      sort-icon-left
      responsive="sm"
    >

    
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
          { key: 'outdatedNewVer', label: 'Outdated', sortable: true }



        ]

    async function getInfo(){
      
      const data = await brewInfo.getInfo(status);
      brewCasksInfo.value = data.brewCasksInfo
      brewLsFormulas.value =  data.brewLsFormulas
    }

    return {  getInfo, status, brewCasksInfo, 
      brewLsFormulas, brewCasksFields }; 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
