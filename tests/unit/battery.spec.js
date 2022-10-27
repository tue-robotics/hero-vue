import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import { BProgressBar } from 'bootstrap-vue'
import Battery from '@/components/battery.vue'
import Vue from 'vue'

const FakeTimers = require('@sinonjs/fake-timers')

describe('battery.vue', () => {
  const autoRos = new AutoRos()
  const wrapper = mount(Battery, {
    propsData: {
      ros: autoRos.ros
    }
  })

  let clock

  beforeEach(function () {
    clock = FakeTimers.install()
  })

  afterEach(() => {
    for (const prop of Object.getOwnPropertyNames(wrapper.vm.$data.batteries)) {
      delete wrapper.vm.$data.batteries[prop]
    }
    clock.uninstall()
  })

  it('Batteries should be empty on startup', () => {
    expect(Object.keys(wrapper.vm.$data.batteries)).to.have.lengthOf(0)
    expect(wrapper.findAll('battery_col')).to.have.lengthOf(0)
  })

  it('Batteries should be alphabetical', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: 'hero2', power_supply_status: 1 })
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: 'hero1', power_supply_status: 1 })
    expect(Object.keys(wrapper.vm.$data.batteries)).to.deep.equal(['hero1', 'hero2'])
  })

  it('Two battery_col should be rendered alphabetical', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: 'hero2', power_supply_status: 1 })
    wrapper.vm.handleBatteryMsg({ percentage: 1.0, location: 'hero1', power_supply_status: 1 })
    return Vue.nextTick().then(() => {
      const batteryCols = wrapper.findAll('#battery_col')
      expect(batteryCols).to.have.lengthOf(2)
      expect(batteryCols.at(0).get('h5').text()).to.equal('hero1')
      expect(batteryCols.at(1).get('h5').text()).to.equal('hero2')
    })
  })

  it('Percentage should be in [0, 100]', () => {
    for (let i = 0; i < 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: Math.random(), location: 'hero1', power_supply_status: 1 })
      expect(wrapper.vm.$data.batteries.hero1.percentage).to.be.at.least(0).and.at.most(100)
    }
  })

  it('Battery color type should match battery percentage', () => {
    for (let i = 0; i <= 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: i / 10, location: 'hero1', power_supply_status: 1 })
      const percentage = wrapper.vm.$data.batteries.hero1.percentage
      let type
      if (percentage > 40) {
        type = 'success'
      } else if (percentage > 20) {
        type = 'warning'
      } else {
        type = 'danger'
      }
      expect(wrapper.vm.$data.batteries.hero1.type).to.equal(type)
    }
  })

  it('Rendered battery color should match backend state: 0.1', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.1, location: 'hero1', power_supply_status: 1 })
    return Vue.nextTick().then(() => {
      expect(wrapper.getComponent(BProgressBar).classes().some(x => x.includes('danger')))
    })
  })

  it('Rendered battery color should match backend state: 0.3', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.3, location: 'hero1', power_supply_status: 1 })
    return Vue.nextTick().then(() => {
      expect(wrapper.getComponent(BProgressBar).classes().some(x => x.includes('warning')))
    })
  })

  it('Rendered battery color should match backend state: 0.5', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: 'hero1', power_supply_status: 1 })
    return Vue.nextTick().then(() => {
      expect(wrapper.getComponent(BProgressBar).classes().some(x => x.includes('success')))
    })
  })

  it('Battery should go "dark" and shouldn\'t be charging after timeout', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: 'hero1', power_supply_status: 1 })
    expect(wrapper.vm.$data.batteries.hero1.type).to.equal('success')
    expect(wrapper.vm.$data.batteries.hero1.charging).to.equal(true)
    return Vue.nextTick().then(() => {
      expect(wrapper.getComponent(BProgressBar).classes().some(x => x.includes('success'))).to.equal(true)
      expect(wrapper.findAll('#bolt')).to.have.lengthOf(1)
      clock.tick(10000)
      expect(wrapper.vm.$data.batteries.hero1.type).to.equal('dark')
      expect(wrapper.vm.$data.batteries.hero1.charging).to.equal(false)
      return Vue.nextTick().then(() => {
        expect(wrapper.getComponent(BProgressBar).classes().some(x => x.includes('dark'))).to.equal(true)
        expect(wrapper.findAll('#bolt')).to.have.lengthOf(0)
      })
    })
  })

  it('Battery should be deleted after timeout', () => {
    wrapper.vm.handleBatteryMsg({ percentage: 0.5, location: 'hero1', power_supply_status: 1 })
    expect(Object.keys(wrapper.vm.$data.batteries)).to.have.lengthOf(1)
    return Vue.nextTick().then(() => {
      expect(wrapper.findAll('#battery_col')).to.have.lengthOf(1)
      clock.tick(60000)
      expect(Object.keys(wrapper.vm.$data.batteries)).to.have.lengthOf(0)
      return Vue.nextTick().then(() => {
        expect(wrapper.findAll('#battery_col')).to.have.lengthOf(0)
      })
    })
  })
})
