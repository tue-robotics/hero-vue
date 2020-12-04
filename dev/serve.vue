<script>
import Vue from 'vue'
import { AutoRos, Battery } from '@/entry'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Battery
  },
  data () {
    return {
      ros: AutoRos.ros
    }
  },
  mounted () {
    AutoRos.connect()
  }
})
</script>

<template>
  <div id="app">
    <Battery
      :ros="ros"
    />
  </div>
</template>
