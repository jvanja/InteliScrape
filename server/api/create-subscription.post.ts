import type { H3Event } from 'h3'
import { readBody, useRuntimeConfig } from '#imports'
import Stripe from 'stripe'

export default async (event: H3Event) => {
  try {
    // Read the POST body
    const body = await readBody<{ accountType: string }>(event)
    const accountType = body.accountType

    // If accountType is custom, we don't create a subscription checkout.
    if (accountType === 'custom') {
      return { error: 'Custom subscriptions require direct contact.' }
    }

    const config = useRuntimeConfig()
    const stripeSecretKey = config.stripeSecretKey as string
    const stripeSuccessUrl = config.public.stripeSuccessUrl as string
    const stripeCancelUrl = config.public.stripeCancelUrl as string

    // Determine the price id based on account type
    const priceId =
      accountType === 'pro'
        ? config.public.stripeProPriceId
        : config.public.stripeRegularPriceId

    if (!priceId) {
      return { error: 'Price ID is not configured for this subscription type.' }
    }

    // Initialize Stripe using the new API version.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    })

    // Create a subscription checkout session.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId as string,
          quantity: 1,
        },
      ],
      success_url: `${stripeSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: stripeCancelUrl,
    })

    return { url: session.url }
  } catch (error: any) {
    return { error: error.message || 'Subscription creation failed.' }
  }
}
