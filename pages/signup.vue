<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form @submit.prevent="handleSignUp" class="space-y-5">
        <div>
          <label for="fullName" class="block mb-1 font-medium">Full Name</label>
          <input
            id="fullName"
            type="text"
            v-model="fullName"
            placeholder="John Doe"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label for="email" class="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign Up
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
        <GoogleButton>Sign up with Google</GoogleButton>
      </button>

      <p class="mt-4 text-center text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 font-semibold">Log In</NuxtLink>
      </p>
      <div v-if="errorMessage" class="text-red-500 mt-4 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const supabase = useSupabaseClient()
const router = useRouter()

const handleSignUp = async () => {
  errorMessage.value = ''
  const { error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
      },
    },
  })

  if (signUpError) {
    errorMessage.value = signUpError.message
  } else {
    // Optionally display a success message or redirect the user.
    // For example, redirect to the login page:
    router.push('/login')
  }
}
//
// Handle Google login
async function loginWithGoogle() {
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    // If needed, pass `options: { redirectTo: '...' }` here
  })
  if (error) {
    errorMessage.value = error.message
  }
}

// Call this function to charge the user. Blur the results until paid.
async function handleCheckout(costUsd: number) {
  console.log(`charging user ${costUsd}`)
  try {
    // POST to our /api/create-checkout-session endpoint
    const { url, error } = await $fetch('/api/create-checkout-session', {
      method: 'POST',
      body: { costUsd: costUsd },
    })
    if (error) {
      console.error('Checkout session error:', error)
      return
    }
    // If we got a URL, redirect the user to Stripe Checkout
    if (url) {
      window.location.href = url
    }
  } catch (err) {
    console.error('Error initiating checkout:', err)
  }
}
</script>
