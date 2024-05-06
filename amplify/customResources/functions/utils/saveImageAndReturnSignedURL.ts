import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client()

export async function saveImageAndReturnSignedURL({
	bucketName,
	customerName,
	bufferImg,
	subPathDir,
}: {
	bucketName: string
	customerName: string
	bufferImg: Buffer
	subPathDir: string
}) {
	const imgKey = customerName.split(' ').join('-').toLocaleLowerCase() + '.png'
	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: `${subPathDir}/${imgKey}`,
				Body: bufferImg,
				ContentType: 'image/png',
			})
		)

		// Get a signed URL of the new image stored in S3 so that twilio can use it
		const url = await getSignedUrl(
			s3Client,
			new GetObjectCommand({
				Bucket: bucketName,
				Key: `${subPathDir}/${imgKey}`,
			}),
			{
				expiresIn: 3600, // URL expires in 1 hour
			}
		)

		return url
	} catch (e: any) {
		console.log('error saving image', e)
		throw new Error(e.message)
	}
}
