// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '' as string,
    fullName: '' as string,
    email: '' as string,
    accountType: '' as string,
    stripeCustomerId: '' as string,
    loggedIn: false,
  }),
  getters: {
    isLoggedIn: (state) => state.loggedIn,
  },
  actions: {
    /**
     * Set user data after login or fetching from the backend.
     */
    setUser(userData: {
      id: string
      fullName: string
      email: string
      accountType?: string
      stripeCustomerId?: string
    }) {
      this.id = userData.id
      this.fullName = userData.fullName
      this.email = userData.email
      this.accountType = userData.accountType || ''
      this.stripeCustomerId = userData.stripeCustomerId || ''
      this.loggedIn = true
    },

    /**
     * Clear user data on logout.
     */
    clearUser() {
      this.$reset()
    },
  },
})
