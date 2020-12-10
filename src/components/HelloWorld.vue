<template>
  <div class="hello">
    <p>
      <button v-on:click="getInfo">getInfo</button>
      <br />
      {{ status }}
    </p>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api'
import { BrewInfo } from "../src/BrewInfo";

export default {
  setup() {
    const brewInfo = new BrewInfo()
    const status = ref("")
    

    function getInfo(){
      
      return brewInfo.getInfo(status);

    }

    return {  getInfo, status }; // anything returned here will be available for the rest of the component
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
