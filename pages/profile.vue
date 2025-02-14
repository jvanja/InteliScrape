<template>
  <div class="container mx-auto p-4 max-w-xl">
    <h1 class="text-2xl font-bold mb-6">Your Profile</h1>
    <form @submit.prevent="saveProfile" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          v-model="profile.full_name"
          placeholder="John Doe"
          class="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Email</label>
        <input
          type="email"
          v-model="profile.email"
          required
          disabled
          class="w-full border border-gray-300 p-2 rounded bg-gray-100"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Billing Address</label>
        <input
          type="text"
          v-model="profile.address"
          placeholder="123 Main St"
          class="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium">City</label>
          <input
            type="text"
            v-model="profile.city"
            placeholder="City"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">State</label>
          <input
            type="text"
            v-model="profile.state"
            placeholder="State"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-medium">Zip Code</label>
          <input
            type="text"
            v-model="profile.zip"
            placeholder="Zip Code"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">Country</label>
          <input
            type="text"
            v-model="profile.country"
            placeholder="Country"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          @click="openPaymentPortal"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Update Payment Method
        </button>
      </div>
      <div v-if="message" class="text-center text-green-600 mt-2">
        {{ message }}
      </div>
      <div v-if="error" class="text-center text-red-600 mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.types'
type Profile = Database['public']['Tables']['profiles']['Row']

// Initialize profile state. If no profile exists yet, some fields will be empty.
const profile = ref<Profile>({
  id: '',
  full_name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  created_at: '',
  updated_at: ''
})

// Message and error state.
const message = ref('')
const error = ref('')

// Access the Supabase client and current user.
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Fetch the user's profile from Supabase.
// Assumes that the "profiles" table has a primary key "id" corresponding to the user's id.
const fetchProfile = async () => {
  if (!user.value) return
  const { data, error: fetchError } = await supabase.from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .maybeSingle()

  if (fetchError) {
    console.error('Error fetching profile:', fetchError.message)
  } else if (data) {
    profile.value = {
      id: data.id,
      full_name: data.full_name || '',
      email: data.email || user.value.email,
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      country: data.country || '',
    }
  } else {
    // No profile exists yet—pre-fill email and id.
    profile.value.email = user.value.email
    profile.value.id = user.value.id
  }
}

onMounted(() => {
  fetchProfile()
})

// Save the profile updates to the "profiles" table.
const saveProfile = async () => {
  if (!user.value) return

  // First, check if a profile already exists.
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .maybeSingle()

  if (fetchError) {
    error.value = fetchError.message
    message.value = ''
    return
  }

  if (existingProfile) {
    // Update the existing profile.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.value.full_name,
        email: profile.value.email,
        address: profile.value.address,
        city: profile.value.city,
        state: profile.value.state,
        zip: profile.value.zip,
        country: profile.value.country,
      })
      .eq('id', user.value.id)
    if (updateError) {
      error.value = updateError.message
      message.value = ''
    } else {
      message.value = 'Profile updated successfully.'
      error.value = ''
    }
  } else {
    // Insert a new profile record.
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.value.id,
          full_name: profile.value.full_name,
          email: profile.value.email,
          address: profile.value.address,
          city: profile.value.city,
          state: profile.value.state,
          zip: profile.value.zip,
          country: profile.value.country,
        },
      ])
    if (insertError) {
      error.value = insertError.message
      message.value = ''
    } else {
      message.value = 'Profile saved successfully.'
      error.value = ''
    }
  }
}

// Open the payment portal for updating the payment method.
// Replace with your actual Stripe Customer Portal integration.
const openPaymentPortal = async () => {
  navigateTo('/customer-portal')
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
