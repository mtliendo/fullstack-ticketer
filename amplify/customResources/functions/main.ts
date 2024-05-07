// import * as bwipjs from 'bwip-js'
import sharp from 'sharp'
import { getTemplateImageFromS3 } from './utils/getTemplateImageFromS3'
import { getFontFromS3AndSaveLocally } from './utils/getFontFromS3AndSaveLocally'
import { generateNameSVG } from './utils/generateNameSVG'
import { saveImageAndReturnSignedURL } from './utils/saveImageAndReturnSignedURL'
import { sendTwilioMMS } from './utils/sendTwilioMMS'
import { verifyWebhookSig } from './utils/verifyStripeWebhook'

const bucketName = process.env.BUCKET_NAME as string
const templateFontKey = process.env.TEMPLATE_FONT_KEY as string
const templateImageKey = process.env.TEMPLATE_IMAGE_KEY as string
const subPathDir = process.env.ITEMS_SUBPATH_DIR as string
const twilioAccountSid = process.env.TWILIO_PARAMETER_SID as string
const twilioAuthToken = process.env.TWILIO_PARAMETER_AUTH_TOKEN as string
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string
const stripeSecretPath = process.env.STRIPE_PARAMETER_SECRET as string
const stripeWebhookSecretPath = process.env.STRIPE_PARAMETER_WEBHOOK_SECRET!

const eventsPath = `/tmp/${subPathDir}`
const downloadPath = `/tmp/${subPathDir}/${templateFontKey}`

const mainFlow = async (customerName: string, customerPhoneNumber: string) => {
	//get template image from s3
	const res = await getTemplateImageFromS3({
		bucketName,
		imgKey: `${subPathDir}/${templateImageKey}`,
	})
	// If there isn't an image, then error out
	if (!res?.Body) throw new Error('No body found in response')

	// Transform the image to a byte array so it can be converted to a buffer that Sharp can use
	const imageByteArr = await res.Body.transformToByteArray()
	const imageBuffer = Buffer.from(imageByteArr)
	const templateImage = sharp(imageBuffer)

	// Get the font from S3 and Save it locally
	await getFontFromS3AndSaveLocally({
		bucketName,
		imgKey: `${subPathDir}/${templateFontKey}`,
		dir: eventsPath,
		downloadPath,
	})

	// Generate customer name for ticket as buffer
	const customerNameImageBuffer = await generateNameSVG(
		customerName,
		`${eventsPath}/${templateFontKey}`
	)

	// Params to overlay the nameSVG onto the template file
	const nameSVGOverlay = {
		input: customerNameImageBuffer,
		top: 700,
		left: 600,
	}

	// Actually create the new image
	const finishedImgBuffer = await templateImage
		.composite([nameSVGOverlay])
		.toBuffer()

	// Store the new image in S3, this serves as a receipt.
	const url = await saveImageAndReturnSignedURL({
		bucketName,
		customerName,
		bufferImg: finishedImgBuffer,
		subPathDir,
	})
	console.log('the url', url)

	await sendTwilioMMS({
		twilioSIDName: twilioAccountSid,
		twilioAuthTokenName: twilioAuthToken,
		twilioPhoneNumber: twilioPhoneNumber,
		customerName,
		customerPhoneNumber,
		mediaUrl: [url],
	})
}

exports.handler = async (event: any) => {
	//Verify the Stripe webhook
	const stripeEvent = await verifyWebhookSig(
		stripeSecretPath,
		event,
		stripeWebhookSecretPath
	)
	console.log('stripeEvent', stripeEvent)
	//Only run the below code when a payment is successfully completed

	switch (stripeEvent.type) {
		case 'checkout.session.completed':
			await mainFlow(
				stripeEvent.data.object.customer_details?.name || 'you',
				stripeEvent.data.object.customer_details?.phone as string
			)
			break
		default:
			return
	}

	return {
		message: 'process complete',
	}
}
