import { Stack } from 'aws-cdk-lib'
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path'

type StripeToTwilioFuncProps = {
	bucketArn: string
}

const __dirname = import.meta.dirname

export const createStripeToTwilioFunc = (
	scope: Stack,
	props: StripeToTwilioFuncProps
) => {
	const sharpLayer = LayerVersion.fromLayerVersionArn(
		scope,
		`stripe-to-twilio-sharpLayer`,
		process.env.SHARP_LAYER_ARN!
	)

	const stripeToTwilioWebhook = new NodejsFunction(
		scope,
		'stripe-to-twilio-webhook',
		{
			functionName: 'amplify-stripe-to-twilio-webhook',
			entry: path.join(__dirname, './main.ts'),
			runtime: Runtime.NODEJS_20_X,
			handler: 'handler',
			layers: [sharpLayer],
			environment: {
				BUCKET_ARN: props.bucketArn,
				TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER!,
			},
			bundling: {
				externalModules: ['sharp'],
			},
		}
	)

	return stripeToTwilioWebhook
}
