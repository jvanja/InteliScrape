<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded">
      <h1 class="text-2xl font-bold mb-6 text-center">Log In</h1>

      <!-- Email/Password Login Form -->
      <form class="space-y-5" @submit.prevent="loginUser">
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
          class="w-full border border-gray-300 text-gray-600 py-2 rounded font-semibold hover:bg-blue-200 transition-colors"
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
        class="w-full border border-red-600 text-gray-600 py-2 rounded font-semibold hover:bg-red-200 transition-colors"
        @click="loginWithGoogle"
      >
        <GoogleButton>Login with Google</GoogleButton>
      </button>

      <div class="text-gray-500 mt-4 text-center">
        Don't have an account yet?
        <NuxtLink class="text-blue-600 font-semibold" to="/signup"
          >Sign up</NuxtLink
        >
      </div>
      <!-- Error message -->
      <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Handle email+password login
async function loginUser() {
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
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
    provider: 'google',
  })
  if (error) {
    errorMessage.value = error.message
  }
}
</script>
