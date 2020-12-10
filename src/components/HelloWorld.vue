<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p> {{result}}</p>
  </div>
</template>

<script lang="ts">
// use the APIs
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const result = ref("shalom")


    return {
      result,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
