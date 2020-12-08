import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import { BButton } from 'bootstrap-vue'
import Indicator from '@/components/indicator.vue'

import Vue from 'vue'

describe('indicator.vue', () => {
  const wrapper = mount(Indicator, {
    propsData: {
      ros: AutoRos.ros
    }
  })
  const button = wrapper.getComponent(BButton)

  it('Type should be "dark" on startup.', () => {
    expect(wrapper.vm.$data.type).to.be.a('string')
    expect(wrapper.vm.$data.type).to.equal('dark')
    expect(button.classes()).to.include('btn-dark')
  })

  it('Button should be disabled', () => {
    expect(button.classes()).to.include('disabled')
  })

  it('Receive false, button should be green', () => {
    wrapper.vm.handleMsg({ data: false })
    expect(wrapper.vm.$data.type).to.equal('success')
    return Vue.nextTick().then(() => {
      expect(button.classes()).to.include('btn-success')
    })
  })

  it('Receive true, button should be red', () => {
    wrapper.vm.handleMsg({ data: true })
    expect(wrapper.vm.$data.type).to.equal('danger')
    return Vue.nextTick().then(() => {
      expect(button.classes()).to.include('btn-danger')
    })
  })

  it('ROS closes, button should be "dark"', () => {
    AutoRos.ros.emit('close')
    expect(wrapper.vm.$data.type).to.equal('dark')
    return Vue.nextTick().then(() => {
      expect(button.classes()).to.include('btn-dark')
    })
  })
})
