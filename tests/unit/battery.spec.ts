import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { markRaw } from "vue";
import { AutoRos } from "auto-ros";
import Battery from "@/components/battery.vue";
import { install as FakeTimers } from "@sinonjs/fake-timers";

describe("battery.vue", () => {
  const autoRos = new AutoRos();
  const wrapper = mount(Battery, {
    props: {
      ros: markRaw(autoRos.ros),
    },
  });

  let clock: ReturnType<typeof FakeTimers>;

  beforeEach(() => {
    clock = FakeTimers();
  });

  afterEach(() => {
    // Clear all batteries
    const batteries = wrapper.vm.batteries as Record<string, unknown>;
    for (const prop of Object.getOwnPropertyNames(batteries)) {
      delete batteries[prop];
    }
    clock.uninstall();
  });

  it("Batteries should be empty on startup", () => {
    expect(Object.keys(wrapper.vm.batteries)).toHaveLength(0);
    expect(wrapper.findAll(".col")).toHaveLength(0);
  });

  it("Batteries should be alphabetical", () => {
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: "hero2", power_supply_status: 1 });
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: "hero1", power_supply_status: 1 });
    expect(Object.keys(wrapper.vm.batteries)).toEqual(["hero1", "hero2"]);
  });

  it("Two battery cols should be rendered alphabetical", async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: "hero2", power_supply_status: 1 });
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: "hero1", power_supply_status: 1 });
    await wrapper.vm.$nextTick();
    const batteryCols = wrapper.findAll(".col");
    expect(batteryCols).toHaveLength(2);
    expect(batteryCols[0].get("h5").text()).toContain("hero1");
    expect(batteryCols[1].get("h5").text()).toContain("hero2");
  });

  it("Percentage should be in [0, 100]", () => {
    for (let i = 0; i < 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: Math.random(), location: "hero1", power_supply_status: 1 });
      expect(wrapper.vm.batteries.hero1.percentage).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.batteries.hero1.percentage).toBeLessThanOrEqual(100);
    }
  });

  it("Battery color type should match battery percentage", () => {
    for (let i = 0; i <= 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: i / 10, location: "hero1", power_supply_status: 1 });
      const percentage = wrapper.vm.batteries.hero1.percentage;
      let type;
      if (percentage > 40) {
        type = "success";
      } else if (percentage > 20) {
        type = "warning";
      } else {
        type = "danger";
      }
      expect(wrapper.vm.batteries.hero1.type).toBe(type);
    }
  });

  it("Rendered battery color should match backend state: 0.1", async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.1, location: "hero1", power_supply_status: 1 });
    await wrapper.vm.$nextTick();
    const progressBar = wrapper.find(".progress-bar");
    expect(progressBar.classes()).toContain("bg-danger");
  });

  it("Rendered battery color should match backend state: 0.3", async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.3, location: "hero1", power_supply_status: 1 });
    await wrapper.vm.$nextTick();
    const progressBar = wrapper.find(".progress-bar");
    expect(progressBar.classes()).toContain("bg-warning");
  });

  it("Rendered battery color should match backend state: 0.5", async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: "hero1", power_supply_status: 1 });
    await wrapper.vm.$nextTick();
    const progressBar = wrapper.find(".progress-bar");
    expect(progressBar.classes()).toContain("bg-success");
  });

  it('Battery should go "dark" and shouldn\'t be charging after timeout', async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: "hero1", power_supply_status: 1 });
    expect(wrapper.vm.batteries.hero1.type).toBe("success");
    expect(wrapper.vm.batteries.hero1.charging).toBe(true);
    await wrapper.vm.$nextTick();
    const progressBar = wrapper.find(".progress-bar");
    expect(progressBar.classes()).toContain("bg-success");
    expect(wrapper.findAll("#bolt")).toHaveLength(1);

    await clock.tickAsync(10000);
    expect(wrapper.vm.batteries.hero1.type).toBe("dark");
    expect(wrapper.vm.batteries.hero1.charging).toBe(false);
    await wrapper.vm.$nextTick();
    const progressBarAfter = wrapper.find(".progress-bar");
    expect(progressBarAfter.classes()).toContain("bg-dark");
    expect(wrapper.findAll("#bolt")).toHaveLength(0);
  });

  it("Battery should be deleted after timeout", async () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: "hero1", power_supply_status: 1 });
    expect(Object.keys(wrapper.vm.batteries)).toHaveLength(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".col")).toHaveLength(1);

    await clock.tickAsync(60000);
    expect(Object.keys(wrapper.vm.batteries)).toHaveLength(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".col")).toHaveLength(0);
  });
});
