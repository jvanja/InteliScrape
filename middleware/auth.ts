// // middleware/auth.global.ts
// export default defineNuxtRouteMiddleware((to) => {
//   const user = useSupabaseUser()
//   if (user.value) {
//     if (to.path.startsWith('/login') || to.path.startsWith('/signup')) {
//       console.log('redirecting')
//       return navigateTo('/dashboard')
//     }
//   } else {
//     if (to.path.startsWith('/dashboard')) {
//       return navigateTo('/login')
//     }
//   }
// })
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }
})
