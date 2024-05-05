import wave from '../assets/hero-background-wave.svg'

function Hero() {
	return (
		<div
			className="hero min-h-screen"
			style={{
				backgroundImage: `url(${wave})`,
			}}
		>
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">Hello there</h1>
					<p className="py-6">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
					<a
						href="https://buy.stripe.com/test_fZe16x3983wAbXq8wy"
						className="btn btn-success"
					>
						Purchase Ticket
					</a>
				</div>
			</div>
		</div>
	)
}

export default Hero
