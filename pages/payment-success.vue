<script setup lang="ts">
const route = useRoute()
const { customer, accountType, subscriptionExpires, error } = await $fetch<{
  customer?: any
  accountType?: string
  subscriptionExpires?: string
  error?: string
}>('/api/finalize-subscription', {
  query: { session_id: route.query.session_id },
})
</script>

<template>
  <div class="prose lg:prose-xl m-5">
    <p v-if="error">Error finalizing subscription: {{ error }}</p>
    <div v-else-if="customer && !customer.deleted">
      <h1 class="text-xl text-green-700">
        Thank you, <strong>{{ customer.name || customer.email }}</strong>! Your subscription is
        now active.
      </h1>
      <br />
      Your account type is: <strong>{{ accountType }}</strong>
      <br />
      Your subscription will expire on:
      <strong>{{ formatDate(subscriptionExpires!) }}</strong>
    </div>
    <p v-else-if="customer && customer.deleted">
      It appears your Stripe customer information has been deleted!
    </p>
    <p class="mt-4">Go to Your <NuxtLink to="/dashboard"><Button variant="outline">Dashboard</Button></NuxtLink></p>
  </div>
</template>
