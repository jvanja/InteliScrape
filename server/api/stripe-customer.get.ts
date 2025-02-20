import type { H3Event } from 'h3'
import Stripe from 'stripe'

export default defineEventHandler(async (event: H3Event) => {

  const config = useRuntimeConfig()
  const stripeSecretKey = config.stripeSecretKey as string
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia',
  })

  const query = getQuery(event)
  const sessionId = query.session_id as string
  if (!sessionId) {
    return { error: 'Missing session_id query parameter' }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customer = await stripe.customers.retrieve(session.customer as string)
    return { customer }
  } catch (e: any) {
    return { error: e.message }
  }
})
