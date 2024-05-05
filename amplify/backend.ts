import { defineBackend } from '@aws-amplify/backend'
import { storage } from './storage/resource'
import { createStripeToTwilioFunc } from './customResources/functions/construct'
import * as dotenv from 'dotenv'
import * as path from 'path'
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

createStripeToTwilioFunc(customTicketerResourceStack, {
	bucketArn: backend.storage.resources.bucket.bucketArn,
})
