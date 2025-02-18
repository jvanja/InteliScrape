<template>
  <nav class="bg-white shadow">
    <div
      class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between font-semibold"
    >
      <div class="text-xl">
        <NuxtLink to="/">Verity.ai</NuxtLink>
      </div>
      <NuxtLink to="/pricing">Pricing</NuxtLink>
      <div v-if="user" class="flex gap-x-4 items-center">
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
        <Button variant="secondary" @click="logout">Log Out</Button>
      </div>
      <div v-else>
        <NuxtLink to="/login" class="text-purple-600 font-bold"
          >Log In</NuxtLink
        >
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
