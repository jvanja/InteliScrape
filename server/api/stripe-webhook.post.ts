import Stripe from 'stripe'
import type { H3Event } from 'h3'
import { getRequestHeaders, useRuntimeConfig, readRawBody } from '#imports'

export default async (event: H3Event) => {
  const config = useRuntimeConfig()

  // Retrieve your Stripe secret and webhook secret from runtime config.
  const stripeSecretKey: string = config.stripeSecretKey
  const stripeWebhookSecret: string = config.STRIPE_WEBHOOK_SECRET

  // Create a new Stripe instance with the updated API version.
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia',
  })

  // Get the Stripe signature from the headers.
  const headers = getRequestHeaders(event)
  const sig = headers['stripe-signature'] as string | undefined
  if (!sig) {
    throw new Error('Missing Stripe signature')
  }

  // Read the raw body as a string.
  const rawBodyContent = await readRawBody(event)
  if (!rawBodyContent) {
    throw new Error('Raw body is empty')
  }
  // Convert the raw body string to a Buffer.
  const rawBody = Buffer.from(rawBodyContent)

  // Verify the event with Stripe's helper.
  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      stripeWebhookSecret
    )
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed.', err)
    throw err
  }

  // Handle the event.
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      console.log('Payment success for session:', session.id)
      // TODO: Handle payment success
      // Add your business logic here (e.g., update your database, mark an order as paid, etc.)
      break
    }
    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  // Return a JSON response to acknowledge receipt.
  return { received: true }
}
