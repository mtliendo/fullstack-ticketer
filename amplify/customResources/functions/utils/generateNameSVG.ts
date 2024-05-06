import TextToSVG from 'text-to-svg'

// Create an SVG from text
export async function generateNameSVG(text: string, fontPath: string) {
	const textToSVG = TextToSVG.loadSync(fontPath)

	try {
		const svg = textToSVG.getSVG(text, {
			fontSize: 110,
			anchor: 'top',
			attributes: { fill: 'black' },
		})
		return Buffer.from(svg)
	} catch (err) {
		console.error('Error generating SVG:', err)
		throw err
	}
}
