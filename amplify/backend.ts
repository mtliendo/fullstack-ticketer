import { defineBackend } from '@aws-amplify/backend'
import { storage } from './storage/resource'
import { createStripeToTwilioFunc } from './customResources/functions/construct'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

const dirname = import.meta.dirname

dotenv.config({ path: path.join(dirname, '.env.local') })

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	storage,
})

const customTicketerResourceStack = backend.createStack(
	'TicketerCustomResources'
)

const functionResources = createStripeToTwilioFunc(
	customTicketerResourceStack,
	{
		bucketName: backend.storage.resources.bucket.bucketName,
		region: customTicketerResourceStack.region,
	}
)

functionResources.stripeToTwilioWebhook.addToRolePolicy(
	new PolicyStatement({
		actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
		resources: [
			backend.storage.resources.bucket.bucketArn,
			backend.storage.resources.bucket.bucketArn +
				`/${process.env.ITEMS_SUBPATH_DIR}/*`,
		],
	})
)

functionResources.stripeToTwilioWebhook.addToRolePolicy(
	new PolicyStatement({
		actions: ['ssm:GetParameter'],
		resources: [
			`arn:aws:ssm:${customTicketerResourceStack.region}:${customTicketerResourceStack.account}:parameter/fullstack-ticketer/stripe/*`,
		],
	})
)
functionResources.stripeToTwilioWebhook.addToRolePolicy(
	new PolicyStatement({
		actions: ['ssm:GetParameter'],
		resources: [
			`arn:aws:ssm:${customTicketerResourceStack.region}:${customTicketerResourceStack.account}:parameter/fullstack-ticketer/twilio/*`,
		],
	})
)

backend.addOutput({
	custom: {
		stripeToTwilioFunctionURL: functionResources.functionURL,
	},
})
