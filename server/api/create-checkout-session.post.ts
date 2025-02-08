import Stripe from 'stripe'
import type { H3Event } from 'h3'
import { useRuntimeConfig, readBody } from '#imports'

export default async (event: H3Event) => {
  try {
    // Parse the request body to get the cost in USD
    const body = await readBody<{ costUsd: number }>(event)
    const costUsd = body?.costUsd || 0

    // Access Stripe secret key and URLs from runtime config.
    // Ensure that success and cancel URLs are strings.
    const config = useRuntimeConfig()
    const stripeSecretKey = config.stripeSecretKey
    const stripeSuccessUrl = config.public.stripeSuccessUrl as string
    const stripeCancelUrl = config.public.stripeCancelUrl as string

    // Create a new Stripe instance using the updated API version.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    })

    // Convert the cost (in USD) to cents.
    const amountInCents = Math.round(costUsd * 100)

    // Create the parameters for the Checkout Session.
    // We cast the object as Stripe.Checkout.SessionCreateParams so that
    // TypeScript recognizes the "line_items" property.
    const params = {
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ScrapeWizard Usage',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: stripeSuccessUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: stripeCancelUrl,
    } as Stripe.Checkout.SessionCreateParams

    // Create a Checkout Session using the parameters.
    const session = await stripe.checkout.sessions.create(params)

    // Return the session URL so the client can redirect the user.
    return { url: session.url }
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return { error: error.message }
  }
}
