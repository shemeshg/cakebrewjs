<template>
  <div class="home">
    <SearchComponent/>
  </div>
</template>

<script lang="ts">

import SearchComponent from '@/components/SearchComponent.vue'; // @ is an alias to /src

export default {
  components: {
    SearchComponent,
  },
}
</script>