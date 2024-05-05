function DetailSection({
	bgColor,
	title,
	description,
	layout = 'right',
	btnColor = 'btn-primary',
}: {
	bgColor: string
	title: string
	description: string
	btnColor?: string
	layout?: 'left' | 'right' // 'left' if the image is to be on the left, 'right' otherwise
}) {
	const isImageOnLeft = layout === 'left'

	return (
		<section className={`py-12 px-4 sm:px-6 lg:px-8 bg-[${bgColor}]`}>
			<div className="max-w-6xl mx-auto">
				<div
					className={`flex flex-col lg:flex-row items-center ${
						isImageOnLeft ? 'lg:flex-row-reverse' : ''
					}`}
				>
					{/* Text Section */}
					<div className="lg:w-1/2 text-center lg:text-left">
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
							{title}
						</h2>
						<p className="mt-4 text-gray-800">{description}</p>
						<button className={`btn mt-8 ${btnColor}`}>Learn More</button>
					</div>

					{/* Image Section */}
					<div className={`mt-8 lg:mt-0 lg:w-1/2 lg:mr-8 lg:ml-8`}>
						<img
							src="https://via.placeholder.com/600x400"
							alt="Our Services"
							className="rounded-lg shadow-lg mx-auto lg:mx-0"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default DetailSection
