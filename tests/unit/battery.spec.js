import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import Battery from '@/components/battery.vue'

import Vue from 'vue'
// import { random } from 'Math'

describe('battery.vue', () => {
  const wrapper = mount(Battery, {
    propsData: {
      ros: AutoRos.ros
    }
  })
  beforeEach(() => {
    for (const prop of Object.getOwnPropertyNames(wrapper.vm.$data.batteries)) {
      delete wrapper.vm.$data.batteries[prop]
    }
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
    for (var i = 0; i < 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: Math.random(), location: 'hero1', power_supply_status: 1 })
      expect(wrapper.vm.$data.batteries.hero1.percentage).to.be.at.least(0).and.at.most(100)
    }
  })

  it('Progress color should match battery percentage', () => {
    var promises = []
    for (var i = 0; i < 10; i++) {
      wrapper.vm.handleBatteryMsg({ percentage: Math.random(), location: 'hero1', power_supply_status: 1 })
      promises.push(Vue.nextTick().then(() => {
        // console.log(wrapper.b-progress-bar
        expect(false)
      }))
    }
    return promises
  })
})
