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
        <!-- Account Type Selection -->
        <div class="mb-4">
          <label class="block mb-1 font-medium">Account Type</label>
          <div class="flex space-x-4">
            <label>
              <input
                type="radio"
                value="regular"
                v-model="profile.account_type"
              />
              <span class="ml-1"
                >Regular ($20/month, max 10 pages/batch, 1 batch/day)</span
              >
            </label>
            <label>
              <input type="radio" value="pro" v-model="profile.account_type" />
              <span class="ml-1"
                >Pro ($50/month, max 100 pages/batch, 10 batches/day)</span
              >
            </label>
            <label>
              <input
                type="radio"
                value="custom"
                v-model="profile.account_type"
              />
              <span class="ml-1">Custom (Contact us)</span>
            </label>
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
    <div v-if="activeTab === 'billing'">
      <h1 class="text-2xl font-bold mb-4">Billing Information</h1>
      <!-- Assuming CardForm is a component to update card details -->
      <CardForm />
    </div>
  </div>
</template>

<script setup lang="ts">
/* Auto-imported: 
   - useSupabaseClient, useSupabaseUser, $fetch, Button, CardForm, etc.
*/

// --- Types ---
type ProfileType = {
  id: string
  full_name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  account_type: string
}

// --- Reactive State ---
const activeTab = ref<'profile' | 'billing'>('profile')

const profile = ref<ProfileType>({
  id: '',
  full_name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  account_type: 'regular', // default account type
})

const message = ref('')
const errorMessage = ref('')

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// --- Fetch Profile ---
async function fetchProfile() {
  if (!user.value) return
  const { data, error: fetchError } = await supabase
    .from<ProfileType>('profiles')
    .select('*')
    .eq('id', user.value.id)
    .maybeSingle()

  if (fetchError) {
    console.error('Error fetching profile:', fetchError.message)
  } else if (data) {
    profile.value = {
      ...data,
      account_type: data.account_type || 'regular',
    }
  } else {
    // If no profile exists yet, pre-fill email and id.
    profile.value.email = user.value.email
    profile.value.id = user.value.id
  }
}

// --- Subscription Checkout ---
// Trigger the subscription checkout for regular/pro accounts.
async function handleSubscription(accountType: string) {
  // For Regular and Pro accounts, start a subscription checkout session.
  if (accountType === 'regular' || accountType === 'pro') {
    const response = await $fetch<{ url?: string; error?: string }>(
      '/api/create-subscription',
      {
        method: 'POST',
        body: { accountType },
      }
    )
    if (response.error) {
      console.error('Subscription error:', response.error)
      throw new Error(response.error)
    }
    if (response.url) {
      // Redirect to Stripe's subscription checkout session.
      window.location.href = response.url
    }
  }
}

// --- Save Profile ---
// Save profile info and trigger subscription checkout if needed.
async function handleSubmit() {
  errorMessage.value = ''
  message.value = ''

  // Check if the account type is valid.
  if (!['regular', 'pro', 'custom'].includes(profile.value.account_type)) {
    errorMessage.value = 'Please select a valid account type.'
    return
  }

  // Determine if we need to start a subscription.
  const needsSubscription =
    profile.value.account_type === 'regular' ||
    profile.value.account_type === 'pro'

  // Check if profile already exists.
  const { data: existingProfile, error: fetchError } = await supabase
    .from<ProfileType>('profiles')
    .select('*')
    .eq('id', user.value!.id)
    .maybeSingle()

  let opError = null
  if (existingProfile) {
    // Update existing profile.
    const { error: updateError } = await supabase
      .from<ProfileType>('profiles')
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
      .from<ProfileType>('profiles')
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
  }

  message.value = 'Profile saved successfully.'

  // Automatically trigger subscription checkout if needed.
  try {
    if (needsSubscription) {
      await handleSubscription(profile.value.account_type)
    }
  } catch (subError: any) {
    // If there's a subscription error, display it.
    errorMessage.value = subError.message || 'Subscription failed.'
    return
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
