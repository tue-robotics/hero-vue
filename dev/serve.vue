<script>
import Vue from 'vue';
import { HeroVueSample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    HeroVueSample,
  }
});
</script>

<template>
  <div id="app">
    <hero-vue-sample />
  </div>
</template>
