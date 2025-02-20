import type { H3Event } from 'h3'
import Stripe from 'stripe'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Expected body fields:
    // - accountType: "regular" | "pro" | "custom"
    // - customerId: string (Stripe Customer ID)
    // - savedCard?: { stripe_payment_method_id: string, card_brand?: string, card_last4?: string }
    const body = await readBody<{
      accountType: string
      customerId: string
      savedCard?: {
        stripe_payment_method_id: string
        card_brand?: string
        card_last4?: string
      }
    }>(event)

    const { accountType, customerId, savedCard } = body

    // For custom, require direct contact.
    if (accountType === 'custom') {
      return { error: 'Custom subscriptions require direct contact.' }
    }

    const config = useRuntimeConfig()
    const stripeSecretKey = config.stripeSecretKey as string
    const stripeSuccessUrl = config.public.stripeSuccessUrl as string
    const stripeCancelUrl = config.public.stripeCancelUrl as string

    // Choose the correct price ID based on account type.
    const priceId =
      accountType === 'pro'
        ? config.public.stripeProPriceId
        : config.public.stripeRegularPriceId

    if (!priceId) {
      return { error: 'Price ID is not configured for this subscription type.' }
    }

    // Initialize Stripe client using the new API version.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    })

    // If a saved card exists, update the customer's invoice settings so that the saved PaymentMethod is used.
    if (savedCard && savedCard.stripe_payment_method_id) {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: savedCard.stripe_payment_method_id,
        },
      })
    }

    // Build the Checkout Session parameters.
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId as string,
          quantity: 1,
        },
      ],
      success_url: `${stripeSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: stripeCancelUrl,
    }

    // Create the subscription checkout session.
    const session = await stripe.checkout.sessions.create(sessionParams)
    return { url: session.url }
  } catch (error: any) {
    return { error: error.message || 'Subscription creation failed.' }
  }
})
