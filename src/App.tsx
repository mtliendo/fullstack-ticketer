import DetailSection from './components/DetailSection'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import spacerWave from './assets/Layer.svg'

function App() {
	return (
		<>
			<Navbar />
			<Hero />
			<DetailSection
				bgColor="#FE62D4"
				title="eventDetail1"
				btnColor="btn-warning"
				description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit numquam sapiente pariatur quos ipsa magni atque commodi officiis beatae minima architecto eum recusandae tempore corrupti quaerat fugit, nam voluptatum autem!"
			/>
			<div
				className="hero min-h-screen"
				style={{ backgroundImage: `url(${spacerWave})` }}
			>
				<div className="hero-content">
					<DetailSection
						title="eventDetail2"
						layout="left"
						bgColor=""
						btnColor="btn-secondary"
						description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit numquam sapiente pariatur quos ipsa magni atque commodi officiis beatae minima architecto eum recusandae tempore corrupti quaerat fugit, nam voluptatum autem!"
					/>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default App
