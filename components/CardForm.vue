<template>
  <div class="mb-8">
    <!-- If a card is already saved, show its masked details -->
    <div v-if="savedCard && !isEditing">
      <p class="mb-4">
        Card on file: <strong>{{ savedCard.card_brand }}</strong> ending in
        <strong>{{ savedCard.card_last4 }}</strong
        >.
      </p>
      <Button @click="handleUpdateCard">Update Card</Button>
    </div>

    <!-- Card input form is shown if no saved card exists or if the user chooses to update -->
    <div v-if="!savedCard || isEditing">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div id="card-element" class="p-4 border border-gray-300 rounded"></div>
        <Button type="submit">Save Card</Button>
      </form>
    </div>

    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    <div v-if="message" class="text-green-500 mt-2">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, PaymentMethod } from '@stripe/stripe-js'

const config = useRuntimeConfig()
const stripePublicKey = config.public.stripePublicKey as string

const error = ref<string>('')
const message = ref<string>('')
const isEditing = ref<boolean>(false)
const savedCard = ref<{
  stripe_payment_method_id: string | null
  card_brand: string | null
  card_last4: string | null
} | null>(null)

const emit = defineEmits<{
  (e: 'saved-card', card: {
    stripe_payment_method_id: string | null
    card_brand: string | null
    card_last4: string | null
  } | null): void
}>()

const stripeClient = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
let card: any = null

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
      emit('saved-card', data)
    } else {
      emit('saved-card', null)
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

// Function to handle the "Update Card" button click.
// It sets isEditing to true and then waits until the DOM updates before mounting the card element.
const handleUpdateCard = async () => {
  isEditing.value = true
  await nextTick()
  mountCardElement()
}

onMounted(async () => {
  // First, fetch any saved card info.
  await fetchSavedCard()

  // Initialize Stripe client.
  stripeClient.value = await loadStripe(stripePublicKey)
  if (!stripeClient.value) {
    error.value = 'Stripe failed to initialize.'
    return
  }
  elements.value = stripeClient.value.elements()
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
