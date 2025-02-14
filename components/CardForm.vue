<template>
  <div class="max-w-lg mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div id="card-element" class="p-4 border border-gray-300 rounded"></div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Save Card
      </button>
    </form>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    <div v-if="message" class="text-green-500 mt-2">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, PaymentMethod } from '@stripe/stripe-js'

// Get the Stripe publishable key from runtime config.
const config = useRuntimeConfig()
const stripePublicKey = config.public.stripePublicKey as string

const error = ref<string>('')
const message = ref<string>('')

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let card: any = null

onMounted(async () => {
  stripe = await loadStripe(stripePublicKey)
  if (!stripe) {
    error.value = 'Stripe failed to initialize.'
    return
  }
  elements = stripe.elements()
  card = elements.create('card', { hidePostalCode: true })
  card.mount('#card-element')
})

const handleSubmit = async () => {
  if (!stripe || !card) {
    error.value = 'Stripe is not initialized.'
    return
  }

  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: card,
  })

  if (result.error) {
    error.value = result.error.message || 'Payment method creation failed.'
    return
  }

  const paymentMethod = result.paymentMethod as PaymentMethod

  try {
    // Type the response to ensure TypeScript knows about the possible properties.
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
