import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import { BButton } from 'bootstrap-vue'
import Indicator from '@/components/indicator.vue'

describe('indicator.vue', () => {
  const wrapper = mount(Indicator, {
    propsData: {
      ros: AutoRos.ros
    }
  })

  it('type should be "dark" on startup.', () => {
    expect(wrapper.vm.$data.type).to.be.a('string')
    expect(wrapper.vm.$data.type).to.equal('dark')
  })

  it('Button should be disabled', () => {
    const button = wrapper.getComponent(BButton)
    expect(button.classes()).to.include('disabled')
  })
})
