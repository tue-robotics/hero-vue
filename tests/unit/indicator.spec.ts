import { expect, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import Indicator from '@/components/indicator.vue'

describe('indicator.vue', () => {
  const autoRos = new AutoRos()
  const wrapper = mount(Indicator, {
    props: {
      ros: autoRos.ros
    }
  })
  const button = wrapper.find('button')

  it('Type should be "dark" on startup.', () => {
    expect(wrapper.vm.type).toBe('dark')
    expect(button.classes()).toContain('btn-dark')
  })

  it('Button should be disabled', () => {
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('Receive false, button should be green', async () => {
    wrapper.vm.handleMsg({ data: false })
    expect(wrapper.vm.type).toBe('success')
    await wrapper.vm.$nextTick()
    const buttonAfter = wrapper.find('button')
    expect(buttonAfter.classes()).toContain('btn-success')
  })

  it('Receive true, button should be red', async () => {
    wrapper.vm.handleMsg({ data: true })
    expect(wrapper.vm.type).toBe('danger')
    await wrapper.vm.$nextTick()
    const buttonAfter = wrapper.find('button')
    expect(buttonAfter.classes()).toContain('btn-danger')
  })

  it('ROS closes, button should be "dark"', async () => {
    autoRos.ros.emit('close')
    expect(wrapper.vm.type).toBe('dark')
    await wrapper.vm.$nextTick()
    const buttonAfter = wrapper.find('button')
    expect(buttonAfter.classes()).toContain('btn-dark')
  })
})
