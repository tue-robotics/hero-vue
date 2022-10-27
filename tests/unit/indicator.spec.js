import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import { BButton } from 'bootstrap-vue'
import Indicator from '@/components/indicator.vue'
import Vue from 'vue'

describe('indicator.vue', () => {
  const autoRos = new AutoRos()
  const wrapper = mount(Indicator, {
    propsData: {
      ros: autoRos.ros
    }
  })
  const button = wrapper.getComponent(BButton)

  it('Type should be "dark" on startup.', () => {
    expect(wrapper.vm.$data.type).to.be.a('string')
    expect(wrapper.vm.$data.type).to.equal('dark')
    expect(button.classes().some(x => x.includes('dark'))).to.equal(true)
  })

  it('Button should be disabled', () => {
    expect(button.classes()).to.include('disabled')
  })

  it('Receive false, button should be green', () => {
    wrapper.vm.handleMsg({ data: false })
    expect(wrapper.vm.$data.type).to.equal('success')
    return Vue.nextTick().then(() => {
      expect(button.classes().some(x => x.includes('success'))).to.equal(true)
    })
  })

  it('Receive true, button should be red', () => {
    wrapper.vm.handleMsg({ data: true })
    expect(wrapper.vm.$data.type).to.equal('danger')
    return Vue.nextTick().then(() => {
      expect(button.classes().some(x => x.includes('danger'))).to.equal(true)
    })
  })

  it('ROS closes, button should be "dark"', () => {
    autoRos.ros.emit('close')
    expect(wrapper.vm.$data.type).to.equal('dark')
    return Vue.nextTick().then(() => {
      expect(button.classes().some(x => x.includes('dark'))).to.equal(true)
    })
  })
})
