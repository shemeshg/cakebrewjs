<template>
  <div id="app">
    <div id="nav" v-if="isShowNavigation">
      <router-link to="/">Home</router-link> |
      <router-link to="/info">Info</router-link> |
      <router-link to="/brewsh">://brew.sh</router-link> |      
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script lang="ts">
 import { computed, inject  } from "@vue/composition-api";
export default {
  /* eslint-disable */
  setup(prop: any, ctx: any) {
   
      // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    return {isShowNavigation}
  }
}
</script>

<style lang="scss">

</style>
