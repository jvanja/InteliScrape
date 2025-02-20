import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'
type ProfileType = Database['public']['Tables']['profiles']['Row']
// interface UserStore extends ProfileType { isLoggedIn: boolean }

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    full_name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    stripe_customer_id: '',
    stripe_payment_method_id: '',
    card_last4: '',
    card_brand: '',
    account_type: '',
    updated_at: '',
    created_at: '',
    loggedIn: false,
  }),
  getters: {
    isLoggedIn: (state) => state.loggedIn,
  },
  actions: {
    /**
     * Set user data after login or fetching from the backend.
     */
    setUser(userData: ProfileType) {
      // Object.assign(this, userData)
      Object.assign(this, userData ?? {})
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
