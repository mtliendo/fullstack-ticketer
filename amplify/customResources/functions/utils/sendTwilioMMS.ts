import Twilio from 'twilio'
import { getParameter } from './getParameterFromStore'

type sendTwilioProps = {
	twilioSIDName: string
	twilioAuthTokenName: string
	twilioPhoneNumber: string
	mediaUrl: string[]
	customerName: string
	customerPhoneNumber: string
}

export const sendTwilioMMS = async ({
	twilioSIDName,
	twilioAuthTokenName,
	twilioPhoneNumber,
	mediaUrl,
	customerName,
	customerPhoneNumber,
}: sendTwilioProps) => {
	console.log(twilioSIDName)
	console.log(twilioAuthTokenName)
	const twilioSID = await getParameter(twilioSIDName)
	const twilioAuthToken = await getParameter(twilioAuthTokenName)
	const twilioClient = Twilio(twilioSID, twilioAuthToken)

	const msgRes = await twilioClient.messages.create({
		body: `Hey ${customerName}, thank you for your purchase! Here is your ticket.`,
		from: twilioPhoneNumber,
		to: customerPhoneNumber,
		mediaUrl,
	})

	return msgRes.sid
}
