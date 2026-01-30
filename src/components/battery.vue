<template>
  <div class="container-fluid p-0 m-0">
    <div class="row">
      <div
        v-for="(v, key) in batteries"
        :key="key"
        class="col text-center"
      >
        <span>
          <h5 class="align-text-bottom mb-0">
            {{ key }}
            <font-awesome-icon
              v-if="v.charging"
              id="bolt"
              :icon="['fas', 'bolt']"
            />
          </h5>
        </span>
        <div class="progress w-100">
          <div
            class="progress-bar position-relative"
            :class="[`bg-${v.type}`, { 'progress-bar-striped progress-bar-animated': v.charging }]"
            :style="{ width: `${v.percentage}%` }"
            role="progressbar"
            :aria-valuenow="v.percentage"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span class="position-absolute w-100 d-block"><b>{{ v.percentage }}%</b></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { Ros, Topic } from "roslib";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { faBolt } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

  library.add(faBolt);

  interface BatteryState {
    percentage: number;
    type: string;
    charging: boolean;
    TypeTimeOut: ReturnType<typeof setTimeout> | null;
    RemoveTimeOut: ReturnType<typeof setTimeout> | null;
  }

  interface Batteries {
    [key: string]: BatteryState;
  }

  interface BatteryMsg {
    percentage: number;
    location: string;
    power_supply_status: number;
  }

  const props = defineProps<{
    ros: Ros;
  }>();

  const batteries = ref<Batteries>({});
  let batteryTopic: Topic<BatteryMsg> | null = null;

  const setupClearBatteryType = (key: string, seconds = 10) => {
    const battery = batteries.value[key];
    if (battery.TypeTimeOut) {
      clearTimeout(battery.TypeTimeOut);
    }
    battery.TypeTimeOut = setTimeout(() => {
      battery.type = "dark";
      battery.charging = false;
    }, seconds * 1000);
  };

  const setupRemoveBattery = (key: string, seconds = 60) => {
    const battery = batteries.value[key];
    if (battery.RemoveTimeOut) {
      clearTimeout(battery.RemoveTimeOut);
    }
    battery.RemoveTimeOut = setTimeout(() => {
      console.log("deleting battery", key);
      delete batteries.value[key];
    }, seconds * 1000);
  };

  const handleBatteryMsg = (msg: BatteryMsg) => {
    let type = "info";
    const percentage = Math.round(msg.percentage * 100);
    if (percentage > 40) {
      type = "success";
    } else if (percentage > 20) {
      type = "warning";
    } else {
      type = "danger";
    }

    const key = msg.location;

    // Get battery or create new one
    let battery: BatteryState;
    if (!Object.prototype.hasOwnProperty.call(batteries.value, key)) {
      battery = {
        percentage: 0,
        type: "",
        charging: false,
        TypeTimeOut: null,
        RemoveTimeOut: null,
      };
    } else {
      battery = batteries.value[key];
    }

    // Update state
    battery.percentage = percentage;
    battery.type = type;
    battery.charging = msg.power_supply_status === 1; // POWER_SUPPLY_STATUS_CHARGING = 1

    // Update current battery
    batteries.value[key] = battery;

    // Order batteries, so it shown on alphabetical order
    const ordered: Batteries = {};
    Object.keys(batteries.value)
      .sort()
      .forEach((key) => {
        ordered[key] = batteries.value[key];
      });

    // Update batteries with ordered
    batteries.value = ordered;

    // Setup Timeouts for this battery
    setupClearBatteryType(key, 10);
    setupRemoveBattery(key, 60);
  };

  onMounted(() => {
    batteryTopic = new Topic({
      ros: props.ros,
      name: "battery",
      messageType: "sensor_msgs/BatteryState",
    });
    batteryTopic.subscribe(handleBatteryMsg);
  });

  onBeforeUnmount(() => {
    if (batteryTopic) {
      batteryTopic.unsubscribe();
    }
  });
</script>

<style>
  #bolt {
    color: #ffff00;
    height: 1rem;
    width: auto;
  }
  .progress {
    background-color: #d0d0d0;
  }
</style>
