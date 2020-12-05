<script>
import Vue from 'vue'
import AutoRos from 'auto-ros'
import { Battery, Indicator } from '@/entry'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Battery,
    Indicator
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
    <Indicator
      :ros="ros"
    />
    <Battery
      :ros="ros"
    />
  </div>
</template>
