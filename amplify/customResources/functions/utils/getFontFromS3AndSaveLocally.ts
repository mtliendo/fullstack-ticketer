import { GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client()

export async function getFontFromS3AndSaveLocally({
	bucketName,
	imgKey,
	dir,
	downloadPath,
}: {
	bucketName: string
	imgKey: string
	dir: string
	downloadPath: string
}) {
	let fontRes: GetObjectCommandOutput | undefined

	try {
		fontRes = await s3Client.send(
			new GetObjectCommand({
				Bucket: bucketName,
				Key: imgKey,
			})
		)
		console.log('success getting font!')
	} catch (e) {
		console.log('error getting template')
	}
	if (!fontRes?.Body) throw new Error('No body found in response')

	const fontByteArr = await fontRes.Body.transformToByteArray()
	const fontBuffer = Buffer.from(fontByteArr)

	// Ensure the directory doesn't already exist (it could be warm and still there)
	if (!existsSync(dir)) {
		mkdirSync(dir)
	}
	writeFileSync(downloadPath, fontBuffer)
}
