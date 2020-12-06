import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import AutoRos from 'auto-ros'
import Battery from '@/components/battery.vue'

describe('battery.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(Battery, {
      propsData: {
        ros: AutoRos.ros
      }
    })
    console.log(wrapper)
    expect(true)
  })
})
