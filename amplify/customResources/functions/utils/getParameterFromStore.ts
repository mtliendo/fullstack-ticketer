import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const client = new SSMClient({ region: 'us-east-1' })

export async function getParameter(name: string, withDecryption = false) {
	try {
		const command = new GetParameterCommand({
			Name: name,
			WithDecryption: withDecryption,
		})

		const response = await client.send(command)
		const value = response.Parameter?.Value
		if (!value) throw new Error('No value found in response')

		return value
	} catch (error) {
		console.error(`Error getting parameter ${name}:`, error)
	}
}
