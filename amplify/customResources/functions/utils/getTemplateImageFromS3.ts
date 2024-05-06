import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client()

export async function getTemplateImageFromS3({
	bucketName,
	imgKey,
}: {
	bucketName: string
	imgKey: string
}) {
	// Try to get the image from the S3 bucket
	let res: GetObjectCommandOutput | undefined
	try {
		res = await s3Client.send(
			new GetObjectCommand({ Bucket: bucketName, Key: imgKey })
		)
	} catch (e) {
		console.log(e)
		console.log('error getting template', e)
	}

	return res
}
