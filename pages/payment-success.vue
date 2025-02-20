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
    <p v-else-if="customer && !customer.deleted">
      Thank you, {{ customer.name || customer.email }}! Your subscription is now
      active.
      <br />
      Your account type is: {{ accountType }}
      <br />
      Your subscription will expire on: {{ subscriptionExpires }}
    </p>
    <p v-else-if="customer && customer.deleted">
      It appears your Stripe customer information has been deleted!
    </p>
    <p>Go to Your <NuxtLink to="/dashboard">Dashboard</NuxtLink></p>
  </div>
</template>
