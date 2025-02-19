export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const userStore = useUserStore()

  // Get the authenticated user using getUser() so the data is verified.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    userStore.setUser({
      id: user.id,
      fullName: user.user_metadata.full_name || user.email,
      email: user.email!,
      accountType: '', // You can update this later based on your profile data.
      stripeCustomerId: '', // Update if available.
    })
  }

  // Listen for auth state changes. Instead of trusting the event/session directly,
  // we re-fetch the user using getUser() to ensure the data is authentic.
  supabase.auth.onAuthStateChange(async (event, session) => {
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser()
    if (updatedUser) {
      userStore.setUser({
        id: updatedUser.id,
        fullName: updatedUser.user_metadata.full_name || updatedUser.email,
        email: updatedUser.email!,
        accountType: '', // Update as needed.
        stripeCustomerId: '', // Update as needed.
      })
    } else {
      userStore.clearUser()
    }
  })
})
