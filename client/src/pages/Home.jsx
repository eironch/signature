import useStore from "../stores/useStore";
import AnimatedDiv from "../components/AnimatedDiv";

const Home = () => {
	const { setView } = useStore();

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
			<AnimatedDiv className="relative h-screen flex items-center justify-center">
				<div className="text-center z-10">
					<h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">SIGNATURE</h1>
					<p className="text-2xl text-gray-600 mb-2">Hotel & Resort</p>
					<p className="text-xl text-gray-500 mb-8">Elegance, Serene, & Grandeur</p>

					<button
						onClick={() => setView("suites")}
						className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-500 hover:to-amber-500 transform hover:scale-105 transition-all shadow-lg"
					>
						Explore Our Suites
					</button>
				</div>

				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-20 left-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
					<div className="absolute top-40 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
					<div className="absolute bottom-20 left-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
				</div>
			</AnimatedDiv>
		</div>
	);
};

export default Home;
