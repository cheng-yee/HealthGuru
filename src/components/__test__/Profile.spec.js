import { describe, it, expect } from 'vitest'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import { mount } from '@vue/test-utils'

describe("ProfileInfo.vue", () => {
  const wrapper = mount(ProfileInfo)
  it("By default the page name should be: My Profile", () => {
    expect(wrapper.html()).toContain('Profile Info')
  }),

  it('validates weight as between 1 and 250 kg', async () => {
    await wrapper.setData({ weight: '0' })
    wrapper.vm.validateWeight()
    expect(wrapper.vm.errors.weight).toBe('Weight must be between 1 and 250 kg.')

    await wrapper.setData({ weight: '300' })
    wrapper.vm.validateWeight()
    expect(wrapper.vm.errors.weight).toBe('Weight must be between 1 and 250 kg.')

    await wrapper.setData({ weight: '50' }) // valid weight
    wrapper.vm.validateWeight()
    expect(wrapper.vm.errors.weight).toBeNull()
  }),

  it('validates birthday is not more than 100 years ago or in the future', async () => {
    const wrapper = mount(ProfileInfo)
    const today = new Date()
    const validDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate()).toISOString().split('T')[0]

    const oldDate = new Date(today.getFullYear() - 101, today.getMonth(), today.getDate()).toISOString().split('T')[0]
    const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0]

    await wrapper.setData({ birthday: oldDate })
    wrapper.vm.validateBirthday()
    expect(wrapper.vm.errors.birthday).toBe('Invalid Date of Birth')

    await wrapper.setData({ birthday: futureDate })
    wrapper.vm.validateBirthday()
    expect(wrapper.vm.errors.birthday).toBe('Invalid Date of Birth')

    await wrapper.setData({ birthday: validDate }) // valid date
    wrapper.vm.validateBirthday()
    expect(wrapper.vm.errors.birthday).toBeNull()
  })


})
