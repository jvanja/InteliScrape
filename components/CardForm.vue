<template>
  <div>
    <!-- If a card is already saved, show its masked details -->
    <div
      v-if="savedCard && !isEditing"
      class="mb-4 p-4 border border-gray-200 rounded bg-gray-50"
    >
      <p class="text-gray-700">
        Card on file: <strong>{{ savedCard.card_brand }}</strong> ending in
        <strong>{{ savedCard.card_last4 }}</strong
        >.
      </p>
      <button
        @click="isEditing = true; mountCardElement()"
        class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Update Card
      </button>
    </div>

    <!-- Card input form is shown if no saved card exists or if the user chooses to update -->
    <div v-if="!savedCard || isEditing">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div id="card-element" class="p-4 border border-gray-300 rounded"></div>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Save Card
        </button>
      </form>
    </div>

    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    <div v-if="message" class="text-green-500 mt-2">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, PaymentMethod } from '@stripe/stripe-js'
import { useRuntimeConfig, useSupabaseClient, useSupabaseUser } from '#imports'

const config = useRuntimeConfig()
const stripePublicKey = config.public.stripePublicKey as string

const error = ref<string>('')
const message = ref<string>('')

const stripeClient = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
let card: any = null

// Track whether the user has a saved card
const savedCard = ref<{
  stripe_payment_method_id: string
  card_brand: string
  card_last4: string
} | null>(null)
// Track if the user is editing/updating the card
const isEditing = ref<boolean>(false)

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Fetch saved card information from the profile (if exists)
const fetchSavedCard = async () => {
  if (user.value) {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('stripe_payment_method_id, card_brand, card_last4')
      .eq('id', user.value.id)
      .maybeSingle()
    if (fetchError) {
      console.error('Error fetching saved card:', fetchError.message)
    } else if (data && data.stripe_payment_method_id) {
      savedCard.value = data
    }
  }
}

// Mount the Stripe card element into the #card-element container.
const mountCardElement = () => {
  if (stripeClient.value && elements.value) {
    // If there's an existing card element, unmount it first.
    if (card) {
      card.unmount()
    }
    card = elements.value.create('card', { hidePostalCode: true })
    card.mount('#card-element')
  }
}

onMounted(async () => {
  // First, fetch any saved card info.
  await fetchSavedCard()

  // Initialize Stripe client
  stripeClient.value = await loadStripe(stripePublicKey)
  if (!stripeClient.value) {
    error.value = 'Stripe failed to initialize.'
    return
  }
  elements.value = stripeClient.value.elements()
  // If no card is saved, show the card element immediately.
  if (!savedCard.value) {
    isEditing.value = true
    mountCardElement()
  }
})

const handleSubmit = async () => {
  if (!stripeClient.value || !card) {
    error.value = 'Stripe is not initialized.'
    return
  }
  const result = await stripeClient.value.createPaymentMethod({
    type: 'card',
    card: card,
  })
  if (result.error) {
    error.value = result.error.message || 'Payment method creation failed.'
    return
  }
  const paymentMethod = result.paymentMethod as PaymentMethod

  try {
    // Call your API to save the payment method.
    const response = await $fetch<{ error?: string; message?: string }>(
      '/api/save-payment-method',
      {
        method: 'POST',
        body: { paymentMethodId: paymentMethod.id },
      }
    )
    if (response.error) {
      error.value = response.error
      message.value = ''
    } else {
      message.value = response.message || 'Card saved successfully.'
      error.value = ''
      isEditing.value = false
      // Re-fetch the saved card details to display updated info.
      await fetchSavedCard()
    }
  } catch (err) {
    console.log(err)
    error.value = 'Failed to save payment method.'
  }
}
</script>

<style scoped>
#card-element {
  min-height: 40px;
}
</style>
