<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded">
      <h1 class="text-2xl font-bold mb-6 text-center">Log In</h1>

      <!-- Email/Password Login Form -->
      <form @submit.prevent="loginUser" class="space-y-5">
        <div>
          <label class="block mb-1 font-medium" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Log In
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex justify-center items-center my-6">
        <span class="absolute bg-white px-3 text-gray-500">OR</span>
        <div class="w-full h-px bg-gray-300"></div>
      </div>

      <!-- Google Login Button -->
      <button
        @click="loginWithGoogle"
        class="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors"
      >
        <span class="inline-flex items-center">
          <svg class="h-5 w-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.94 0 7.09 1.63 9.25 3.01l6.86-6.86C36.07 2.58 30.63 0 24 0 14.72 0 6.45 5.07 2.47 12.39l8.42 6.56C12.53 11.76 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.145 24.5c0-1.64-.14-3.2-.39-4.72H24v9h12.49c-.55 3-2.22 5.53-4.73 7.24l7.59 5.91C43.52 37.69 46.145 31.43 46.145 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.88 28.95c-.48-1.44-.76-2.97-.76-4.54 0-1.57.28-3.1.76-4.54l-8.42-6.56C.79 17.38 0 20.62 0 24c0 3.38.79 6.62 2.46 9.69l8.42-6.74z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.91-2.13 15.88-5.77l-7.59-5.91c-2.12 1.42-4.87 2.27-8.29 2.27-6.26 0-11.47-4.26-13.34-10.02l-8.42 6.74C6.45 42.93 14.72 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </span>
      </button>

      <!-- Error message -->
      <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient, navigateTo } from '#imports'

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Handle email+password login
async function loginUser() {
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    navigateTo('/dashboard')
  }
}

// Handle Google login
async function loginWithGoogle() {
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
    // If needed, pass `options: { redirectTo: '...' }` here
  })
  if (error) {
    errorMessage.value = error.message
  }
}
</script>

