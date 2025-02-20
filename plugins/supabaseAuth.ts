// import type { Database } from '~/types/database.types'
// type ProfileType = Database['public']['Tables']['profiles']['Row']

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
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error(profileError)
    }
    // Set the user store using data from both auth and the profiles table.
    userStore.setUser(profileData)
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
      userStore.setUser(profileData)
    } else {
      userStore.clearUser()
    }
  })

  // function normalizeUserData(userData: ProfileType): ProfileType {
  //   Object.keys(userData).forEach((key) => {
  //     userData[key] = userData[key] === null ? '' : userData[key]
  //   })
  //   return userData
  // }
})
