<script setup lang="ts">
const route = useRoute()
const { customer, error } = await $fetch<{ customer?: any; error?: string }>('/api/stripe-customer', {
  query: { session_id: route.query.session_id }
})
</script>

<template>
  <div class="prose lg:prose-xl m-5">
    <p>
      <span v-if="customer && !customer.deleted">
        We appreciate your business, {{ customer.name }}!
      </span>
      <span v-else-if="customer && customer.deleted">
        It appears your Stripe customer information has been deleted!
      </span>
      <span v-else-if="error">
        Error: {{ error }}
      </span>
    </p>
    <p>Go to Your <NuxtLink to="/dashboard">Dashboard</NuxtLink></p>
  </div>
</template>
