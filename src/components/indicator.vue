<template>
  <div className="Indicator">
    <b-button
      :variant="type"
      disabled
    >
      <font-awesome-icon
        id="power-off"
        :icon="['fas', 'power-off']"
      />
    </b-button>
  </div>
</template>

<script>
import ROSLIB from 'roslib'

import { BButton } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPowerOff)

export default {
  name: 'IndicatorItem',
  components: {
    'b-button': BButton,
    'font-awesome-icon': FontAwesomeIcon
  },
  props: {
    ros: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      indicatorTopic: new ROSLIB.Topic({
        ros: this.ros,
        name: 'runstop_button',
        messageType: 'std_msgs/Bool'
      }),
      type: 'dark'
    }
  },
  mounted () {
    this.indicatorTopic.subscribe(this.handleMsg)
    this.ros.on('close', this.OnClose.bind(this))
  },
  beforeUnmount () {
    this.indicatorTopic.unsubscribe()
  },
  methods: {
    handleMsg (msg) {
      if (msg.data) {
        this.type = 'danger'
      } else {
        this.type = 'success'
      }
    },
    OnClose () {
      this.type = 'dark'
    }
  }
}
</script>

<style>
</style>
