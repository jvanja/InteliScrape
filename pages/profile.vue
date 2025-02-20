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
    <div v-if="activeTab === 'profile'" class="p-4 border border-gray-200 rounded bg-gray-50">
      <h1 class="text-2xl font-bold mb-4">Your Profile</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
          <Button type="submit">Save Changes</Button>
        </div>
        <div v-if="message" class="text-center text-green-600 mt-2">
          {{ message }}
        </div>
        <div v-if="errorMessage" class="text-center text-red-600 mt-2">
          {{ errorMessage }}
        </div>
      </form>
    </div>

    <!-- Billing Tab Content -->
    <div v-if="activeTab === 'billing'" class="p-4 border border-gray-200 rounded bg-gray-50">
      <AccountBilling />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

// --- Reactive State ---
const activeTab = ref<'profile' | 'billing'>('profile')
const userStore = useUserStore()
const profile = ref(userStore)

const message = ref('')
const errorMessage = ref('')

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// --- Save Profile ---
// Save profile info and trigger subscription checkout if needed.
async function handleSubmit() {
  errorMessage.value = ''
  message.value = ''

  // Check if profile already exists.
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value!.id)
    .maybeSingle()

  if (fetchError) {
    errorMessage.value = fetchError.message
    return
  }

  let opError = null
  if (existingProfile) {
    // Update existing profile.
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
        account_type: profile.value.account_type,
      })
      .eq('id', user.value!.id)
    opError = updateError
  } else {
    // Insert new profile.
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.value!.id,
          full_name: profile.value.full_name,
          email: profile.value.email,
          address: profile.value.address,
          city: profile.value.city,
          state: profile.value.state,
          zip: profile.value.zip,
          country: profile.value.country,
          account_type: profile.value.account_type,
        },
      ])
    opError = insertError
  }

  if (opError) {
    errorMessage.value = opError.message
    return
  } else {
    userStore.setUser(profile.value)
  }

  message.value = 'Profile saved successfully.'
}
</script>
