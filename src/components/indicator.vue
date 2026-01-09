<template>
  <div class="Indicator">
    <button
      class="btn"
      :class="`btn-${type}`"
      disabled
    >
      <font-awesome-icon
        id="power-off"
        :icon="['fas', 'power-off']"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Ros, Topic } from 'roslib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPowerOff)

interface IndicatorMsg {
  data: boolean
}

const props = defineProps<{
  ros: Ros
}>()

const type = ref('dark')
let indicatorTopic: Topic<IndicatorMsg> | null = null

const handleMsg = (msg: IndicatorMsg) => {
  if (msg.data) {
    type.value = 'danger'
  } else {
    type.value = 'success'
  }
}

const OnClose = () => {
  type.value = 'dark'
}

onMounted(() => {
  indicatorTopic = new Topic({
    ros: props.ros,
    name: 'runstop_button',
    messageType: 'std_msgs/Bool'
  })
  indicatorTopic.subscribe(handleMsg)
  props.ros.on('close', OnClose)
})

onBeforeUnmount(() => {
  if (indicatorTopic) {
    indicatorTopic.unsubscribe()
  }
})
</script>

<style scoped>
</style>
