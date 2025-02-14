import type { H3Event } from 'h3'
import { readBody } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default async (event: H3Event) => {
  // Parse the request body to get the paymentMethodId
  const body = await readBody<{ paymentMethodId: string }>(event)
  const { paymentMethodId } = body
  if (!paymentMethodId) {
    return { error: 'Missing payment method ID' }
  }

  // Create a Supabase client using the serverSupabaseClient helper
  const supabase = await serverSupabaseClient(event)
  
  // Retrieve the authenticated user using serverSupabaseUser
  const user = await serverSupabaseUser(event)
  if (!user) {
    return { error: 'User not authenticated' }
  }

  // Update the profiles table with the PaymentMethod ID
  const { error } = await supabase
    .from('profiles')
    .update({ stripe_payment_method_id: paymentMethodId })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { message: 'Payment method saved successfully.' }
}
