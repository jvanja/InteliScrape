// middleware/auth.global.ts
import { defineNuxtRouteMiddleware } from '#app'
import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  // If user is not logged in, redirect to login for protected routes
  if (to.path.startsWith('/dashboard') || to.path.startsWith('/profile') && !user.value) {
    return navigateTo('/login')
  }
})

