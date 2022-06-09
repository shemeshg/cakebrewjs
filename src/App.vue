<template>
  <div id="app">
    <div id="nav" v-if="isShowNavigation">
      <router-link to="/">Home</router-link> |
      <router-link to="/info">Info</router-link> |
      <b-link href="#"  @click="reouteBrewSh">://brew.sh</b-link> |
      <router-link to="/about">About and settings</router-link>
    </div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { computed, inject } from "@vue/composition-api";

export default {
  /* eslint-disable */
  setup(prop: any, ctx: any) {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const isShowNavigation = computed(() => store.state.isShowNavigation);

    function reouteBrewSh (){
      const { shell } = require("electron");
      shell.openExternal("https://brew.sh");
    }

    return { isShowNavigation, reouteBrewSh };
  },
};
</script>

<style lang="scss">
</style>
