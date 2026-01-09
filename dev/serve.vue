<template>
  <div id="app">
    <Indicator :ros="ros" />
    <Battery :ros="ros" />
  </div>
</template>

<script setup lang="ts">
import { markRaw, onMounted } from 'vue'
import { AutoRos } from 'auto-ros'
import { Battery, Indicator } from '@/entry'

const autoRos = new AutoRos()
const ros = markRaw(autoRos.ros)

onMounted(() => {
  autoRos.connect()
})
</script>
