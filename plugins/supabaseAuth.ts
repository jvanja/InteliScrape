export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const userStore = useUserStore();

  // Fetch current user on app startup.
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    userStore.setUser({
      id: user.id,
      fullName: user.user_metadata.full_name || user.email,
      email: user.email!,
      accountType: '', // Update later if needed
      stripeCustomerId: '', // Update from your profiles table if stored
    });
  }

  // Listen for auth state changes.
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      userStore.setUser({
        id: session.user.id,
        fullName: session.user.user_metadata.full_name || session.user.email,
        email: session.user.email!,
        accountType: '', // Update later if needed
        stripeCustomerId: '', // Update later if needed
      });
    } else {
      userStore.clearUser();
    }
  });
});
