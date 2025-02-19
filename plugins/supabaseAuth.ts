export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const userStore = useUserStore()

  // Get the authenticated user (verified from the Auth server)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Fetch additional profile details from your custom profiles table.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type, stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error(profileError)
    }
    // Set the user store using data from both auth and the profiles table.
    userStore.setUser({
      id: user.id,
      fullName: user.user_metadata.full_name || user.email,
      email: user.email!,
      accountType: profileData?.account_type || '', // Default to empty string if not set
      stripeCustomerId: profileData?.stripe_customer_id || '',
    })
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async () => {
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser()
    if (updatedUser) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('account_type, stripe_customer_id')
        .eq('id', updatedUser.id)
        .maybeSingle()

      if (profileError) {
        console.error(profileError)
      }
      userStore.setUser({
        id: updatedUser.id,
        fullName: updatedUser.user_metadata.full_name || updatedUser.email,
        email: updatedUser.email!,
        accountType: profileData?.account_type || '',
        stripeCustomerId: profileData?.stripe_customer_id || '',
      })
    } else {
      userStore.clearUser()
    }
  })
})
