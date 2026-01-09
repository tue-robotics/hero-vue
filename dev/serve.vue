<template>
  <div id="app">
    <Indicator :ros="ros" />
    <Battery :ros="ros" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AutoRos from 'auto-ros'
import { Battery, Indicator } from '@/entry'

const ros = ref(AutoRos.ros)

onMounted(() => {
  AutoRos.connect()
})
</script>
