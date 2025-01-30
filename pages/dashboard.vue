<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="text-xl font-bold">My App</div>
        <div>
          <button
            class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            @click="logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <div v-if="user" class="text-center">
        <h1 class="text-3xl font-semibold mb-4">
          Welcome, <span class="text-blue-600">{{ user.email }}</span>!
        </h1>
        <p class="text-gray-700 mb-6">This is a protected dashboard page.</p>
        <!-- Add your dashboard content here -->
        <div class="p-4 bg-white border border-gray-200 rounded shadow-sm">
          <p>Any data or user-specific content can go here.</p>
        </div>
      </div>

      <div v-else class="text-center mt-10">
        <p class="text-xl text-red-500">You are not logged in.</p>
        <p class="text-gray-700 mt-2">
          <a
            href="/login"
            class="text-blue-600 hover:underline"
          >
            Go to Login
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser, useSupabaseClient, navigateTo } from '#imports'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

