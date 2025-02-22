<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <!-- Tab Navigation -->
    <nav class="flex border-b mb-6">
      <button
        class="px-4 py-2 focus:outline-none"
        :class="
          activeTab === 'profile'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : ''
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
            : ''
        "
        @click="activeTab = 'billing'"
      >
        Billing
      </button>
    </nav>

    <!-- Profile Tab Content -->
    <div class="p-4 border border-gray-400 rounded">
      <div v-if="activeTab === 'profile'">
        <h1 class="text-2xl font-bold mb-4">Your Profile</h1>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              v-model="profile.full_name"
              placeholder="John Doe"
              class="w-full bg-background border border-gray-500 p-2"
            />
          </div>
          <!-- Email -->
          <div>
            <label class="block mb-1 font-medium">Email</label>
            <input
              type="email"
              v-model="profile.email"
              disabled
              class="w-full bg-background border border-gray-500 p-2"
            />
          </div>
          <!-- Billing Address -->
          <div>
            <label class="block mb-1 font-medium">Billing Address</label>
            <input
              type="text"
              v-model="profile.address"
              placeholder="123 Main St"
              class="w-full bg-background border border-gray-500 p-2"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium">City</label>
              <input
                type="text"
                v-model="profile.city"
                placeholder="City"
                class="w-full bg-background border border-gray-500 p-2"
              />
            </div>
            <div>
              <label class="block mb-1 font-medium">State</label>
              <input
                type="text"
                v-model="profile.state"
                placeholder="State"
                class="w-full bg-background border border-gray-500 p-2"
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
                class="w-full bg-background border border-gray-500 p-2"
              />
            </div>
            <div>
              <label class="block mb-1 font-medium">Country</label>
              <input
                type="text"
                v-model="profile.country"
                placeholder="Country"
                class="w-full bg-background border border-gray-500 p-2"
              />
            </div>
          </div>
          <div class="flex items-center justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      <!-- Billing Tab Content -->
      <div v-if="activeTab === 'billing'">
        <AccountBilling />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
  middleware: ['auth'],
})

const { toast } = useToast()

// --- Reactive State ---
const activeTab = ref<'profile' | 'billing'>('profile')
const userStore = useUserStore()
const profile = ref(userStore)

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// --- Save Profile ---
async function handleSubmit() {
  // Check if profile already exists.
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value!.id)
    .maybeSingle()

  if (fetchError) {
    console.warn(fetchError.message)
    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      description: 'There was a problem with your request.',
    })
    return
  }

  let opError = null
  if (existingProfile) {
    // Update existing profile.
    const { data: newProfile, error: updateError } = await supabase
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
      .maybeSingle()

    if (newProfile) {
      userStore.setUser(newProfile)
    }
    opError = updateError
  } else {
    // Insert new profile.
    const { data: newProfile, error: insertError } = await supabase
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
      .maybeSingle()

    if (newProfile) {
      userStore.setUser(newProfile)
    }
    opError = insertError
  }

  if (opError) {
    console.warn(opError.message)
    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      description: 'There was a problem with your request.',
    })
    return
  }
  toast({
    title: 'Update successful',
    description: 'Your profile has been succefully updated',
  })
}
</script>
