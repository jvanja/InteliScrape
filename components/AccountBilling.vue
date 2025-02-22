<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Billing Information</h1>
    <CardForm @saved-card="handleSavedCard" />
    <hr class="my-6" />
    <!-- Account Type Selection -->
    <form @submit.prevent="handleSubscription" class="space-y-4">
      <div class="mb-4">
        <label class="block mb-1 font-medium">Account Type</label>
        <div class="flex space-x-4">
          <label>
            <input type="radio" value="regular" v-model="newSubscription" />
            <span class="ml-1">Regular $20 / month</span>
          </label>
          <label>
            <input type="radio" value="pro" v-model="newSubscription" />
            <span class="ml-1">Pro $50 / month</span>
          </label>
          <label>
            <input type="radio" value="custom" v-model="newSubscription" />
            <span class="ml-1">Custom (Contact us)</span>
          </label>
        </div>
        <div class="text-sm mb-4">
          Expires {{ formatDate(userStore.subscription_expires) }}
        </div>
        <Button type="submit">Update your subscription</Button>
      </div>
      <div v-if="message" class="text-center text-green-600 mt-2">
        {{ message }}
      </div>
      <div v-if="errorMessage" class="text-center text-red-600 mt-2">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const newSubscription = ref(userStore.account_type)
const message = ref('')
const errorMessage = ref('')
const savedCard = ref<{
  stripe_payment_method_id: string | null
  card_brand: string | null
  card_last4: string | null
} | null>(null)

const handleSavedCard = (card: {
  stripe_payment_method_id: string | null
  card_brand: string | null
  card_last4: string | null
} | null) => {
  savedCard.value = card
}

// --- Subscription Checkout ---
async function handleSubscription() {
  // For Regular and Pro accounts, start a subscription checkout session.
  if (newSubscription.value === 'regular' || newSubscription.value === 'pro') {

    // We include the account type, the user's ID, and the saved card details if they exist.
    const payload = {
      accountType: newSubscription.value,
      customerId: userStore.stripe_customer_id,
      ...(savedCard.value ? { savedCard: savedCard.value } : {}),
    }

    // Call the subscription API endpoint.
    const response = await $fetch<{ url?: string; error?: string }>(
      '/api/create-subscription',
      {
        method: 'POST',
        body: payload,
      }
    )

    if (response.error) {
      console.error('Subscription error:', response.error)
      errorMessage.value = response.error
      message.value = ''
    } else if (response.url) {
      // Redirect to Stripe's subscription checkout session.
      window.location.href = response.url
    }
  }
}
</script>
