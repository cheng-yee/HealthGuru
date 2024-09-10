import { describe, it, expect } from 'vitest'
import SelectMuscle from '@/components/workouts/SelectMuscle.vue'
import { mount } from '@vue/test-utils'

describe("SelectMuscle", () => {
  const wrapper = mount(SelectMuscle)
  it("Clicking on traps", async () => {
    const trapsWrapper = wrapper.find('#Trapezius')
    await trapsWrapper.trigger('click')
    expect(wrapper.vm.muscleType).toBe('traps')
    expect(wrapper.vm.loading).toBe(true)
  })

  it("Clicking on lats", async () => {
    const latsWrapper = wrapper.find('#Lats')
    await latsWrapper.trigger('click')
    expect(wrapper.vm.muscleType).toBe('lats')
    expect(wrapper.vm.loading).toBe(true)
  })

  it("Clicking on triceps", async () => {
    const tricepsWrapper = wrapper.find('#Triceps')
    await tricepsWrapper.trigger('click')
    expect(wrapper.vm.muscleType).toBe('triceps')
    expect(wrapper.vm.loading).toBe(true)
  })
})
