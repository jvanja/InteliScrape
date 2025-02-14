<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <!-- Tab Navigation -->
    <nav class="flex border-b mb-6">
      <button
        class="px-4 py-2 focus:outline-none"
        :class="
          activeTab === 'profile'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600'
        "
        @click="activeTab = 'profile'"
      >
        Profile
      </button>
      <button
        class="px-4 py-2 focus:outline-none"
        :class="
          activeTab === 'billing'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-600'
        "
        @click="activeTab = 'billing'"
      >
        Billing
      </button>
    </nav>

    <!-- Profile Tab Content -->
    <div v-if="activeTab === 'profile'">
      <h1 class="text-2xl font-bold mb-4">Your Profile</h1>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <!-- Full Name -->
        <div>
          <label class="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            v-model="profile.full_name"
            placeholder="John Doe"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            type="email"
            v-model="profile.email"
            disabled
            class="w-full border border-gray-300 p-2 rounded bg-gray-100"
          />
        </div>
        <!-- Billing Address -->
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
        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
        <div v-if="message" class="text-center text-green-600 mt-2">
          {{ message }}
        </div>
        <div v-if="error" class="text-center text-red-600 mt-2">
          {{ error }}
        </div>
      </form>
    </div>

    <!-- Billing Tab Content -->
    <div v-if="activeTab === 'billing'">
      <h1 class="text-2xl font-bold mb-4">Billing Information</h1>
      <!-- CardForm is imported from components -->
      <CardForm />
    </div>
  </div>
</template>

<script setup lang="ts">
// Define a TypeScript interface for the profile data.
interface Profile {
  id: string
  full_name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

// Reactive state for the profile. Initialize fields to empty strings.
const profile = ref<Profile>({
  id: '',
  full_name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
})

const message = ref('')
const error = ref('')
const activeTab = ref<'profile' | 'billing'>('profile')

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Fetch profile data for the current user.
const fetchProfile = async () => {
  if (!user.value) return
  const { data, error: fetchError } = await supabase
    .from('profiles')
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
    // If no profile exists yet, pre-fill email and id.
    profile.value.email = user.value.email
    profile.value.id = user.value.id
  }
}

onMounted(() => {
  fetchProfile()
})

// Save the profile data: update if exists, otherwise insert.
const saveProfile = async () => {
  if (!user.value) return
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
      .from<Profile>('profiles')
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
      .from<Profile>('profiles')
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
</script>

<style scoped>
/* Optional: Additional styling for tabs can be added here */
</style>
