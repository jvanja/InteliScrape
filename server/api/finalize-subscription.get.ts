import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import Stripe from 'stripe'

export default async (event: H3Event) => {
  try {
    const query = getQuery(event)
    const sessionId = query.session_id as string
    if (!sessionId) return { error: 'Missing session_id' }

    const config = useRuntimeConfig()
    const stripeSecretKey = config.stripeSecretKey as string
    // const stripeSuccessUrl = config.public.stripeSuccessUrl as string // might be used later
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    })

    // Retrieve the Checkout Session and Subscription
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session || !session.subscription) {
      return { error: 'Subscription not found in session.' }
    }
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    if (!subscription) {
      return { error: 'Subscription not found.' }
    }

    // Extract expiration date from subscription (current_period_end)
    const currentPeriodEnd = subscription.current_period_end
    const subscriptionExpires = new Date(currentPeriodEnd * 1000).toISOString()

    // Determine account type based on Price ID
    const priceId = subscription.items.data[0].price.id
    const stripeRegularPriceId = config.public.stripeRegularPriceId as string
    const stripeProPriceId = config.public.stripeProPriceId as string

    let accountType = 'custom'
    if (priceId === stripeRegularPriceId) {
      accountType = 'regular'
    } else if (priceId === stripeProPriceId) {
      accountType = 'pro'
    }

    // Retrieve the Stripe customer
    const customer = await stripe.customers.retrieve(session.customer as string)
    if (!customer) {
      return { error: 'Customer not found.' }
    }

    // Update the user's profile in Supabase
    const supabase = await serverSupabaseClient(event)
    // const { data: updatedProfile, error: updateError } = await supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        account_type: accountType,
        subscription_expires: subscriptionExpires,
        stripe_customer_id: session.customer as string,
      })
      .eq('stripe_customer_id', session.customer as string)
      .select()
      .maybeSingle()

    if (updateError) {
      return { error: updateError.message }
    }

    return {
      customer,
      accountType,
      subscriptionExpires,
    }
  } catch (error: any) {
    return { error: error.message || 'Finalizing subscription failed.' }
  }
}
