import Stripe from 'stripe'
import { getParameter } from './getParameterFromStore'

type Event = {
	headers: {
		'stripe-signature': string
	}
	body: string
}
export const verifyWebhookSig = async (
	STRIPE_SECRET_PATH: string,
	event: Event,
	STRIPE_WEBHOOK_SECRET_PATH: string
) => {
	console.log('verifyWebhookSig', STRIPE_SECRET_PATH)
	console.log('verifyWebhookSig', STRIPE_WEBHOOK_SECRET_PATH)
	const stripeSecret = await getParameter(STRIPE_SECRET_PATH)
	const stripeWebhookSecret = await getParameter(STRIPE_WEBHOOK_SECRET_PATH)

	console.log('stripeSecret', stripeSecret)
	console.log('stripeWebhookSecret', stripeWebhookSecret)
	if (!stripeSecret || !stripeWebhookSecret)
		throw new Error('can not find secrets')
	const stripe = new Stripe(stripeSecret)
	const sig = event.headers['stripe-signature']

	try {
		const stripeEvent = stripe.webhooks.constructEvent(
			event.body,
			sig,
			stripeWebhookSecret
		)
		return stripeEvent
	} catch (err) {
		console.log('uh oh', err)
		throw Error('Invalid signature')
	}
}
