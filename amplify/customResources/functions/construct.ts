import { Duration, Stack } from 'aws-cdk-lib'
import {
	FunctionUrlAuthType,
	LayerVersion,
	Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path'

type StripeToTwilioFuncProps = {
	bucketName: string
	region: string
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

	console.log(
		'the webhook secret path',
		process.env.STRIPE_PARAMETER_WEBHOOK_SECRET
	)
	const stripeToTwilioWebhook = new NodejsFunction(
		scope,
		'stripe-to-twilio-webhook',
		{
			functionName: 'amplify-stripe-to-twilio-webhook-prod',
			entry: path.join(__dirname, 'main.ts'),
			runtime: Runtime.NODEJS_20_X,
			memorySize: 512,
			layers: [sharpLayer],
			environment: {
				REGION: props.region,
				BUCKET_NAME: props.bucketName,
				ITEMS_SUBPATH_DIR: process.env.ITEMS_SUBPATH_DIR!,
				TEMPLATE_IMAGE_KEY: process.env.TEMPLATE_IMAGE_KEY!,
				TEMPLATE_FONT_KEY: process.env.TEMPLATE_FONT_KEY!,
				TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER!,
				TWILIO_PARAMETER_AUTH_TOKEN: process.env.TWILIO_PARAMETER_AUTH_TOKEN!,
				TWILIO_PARAMETER_SID: process.env.TWILIO_PARAMETER_SID!,
				STRIPE_PARAMETER_SECRET: process.env.STRIPE_PARAMETER_SECRET!,
				STRIPE_PARAMETER_WEBHOOK_SECRET:
					process.env.STRIPE_PARAMETER_WEBHOOK_SECRET!,
			},
			timeout: Duration.seconds(30),
			bundling: {
				externalModules: ['sharp'],
			},
		}
	)

	const functionURL = stripeToTwilioWebhook.addFunctionUrl({
		authType: FunctionUrlAuthType.NONE,
	})

	return { stripeToTwilioWebhook, functionURL: functionURL.url }
}
