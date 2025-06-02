import { Wifi, Tv, Coffee, Star, Users } from "lucide-react";
import AnimatedDiv from "./AnimatedDiv";
import Suite0Image from "../assets/suite_0.png";
import Suite1Image from "../assets/suite_1.png";
import Suite2Image from "../assets/suite_2.png";

const SuiteCard = ({ suite, onBook }) => {
	const getAmenityIcon = (amenity) => {
		const icons = {
			"Free WiFi": <Wifi className="w-5 h-5" />,
			TV: <Tv className="w-5 h-5" />,
			"Smart TV": <Tv className="w-5 h-5" />,
			"Air Conditioning": <Coffee className="w-5 h-5" />,
			"Mini Bar": <Coffee className="w-5 h-5" />,
			"Full Bar": <Coffee className="w-5 h-5" />,
		};
		return icons[amenity] || <Star className="w-5 h-5" />;
	};

	const suiteImages = [Suite0Image, Suite1Image, Suite2Image];

	return (
		<AnimatedDiv className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-950 font-young">
			<img
				className="absolute inset-0 h-full w-full object-cover z-0"
				src={suiteImages[suite.id - 1]}
			/>
			<div className="absolute inset-0 bg-g/30"></div>

			<div className="h-80 bg-f flex flex-col items-center justify-center">
				<div className="z-10 relative flex flex-col justify-center items-center">
					<h3 className="sm:text-7xl text-4xl font-bold text-center text-amber-400 mb-4">{suite.name}</h3>
					<p className="text-b text-xl w-10/12">{suite.description}</p>
				</div>
			</div>

			<div className="relative z-10 bg-gradient-to-b to-40% to-g/60 w-full p-6 items-center flex-col flex">
				<div className="flex items-center sm:flex-row gap-6 flex-col justify-between mb-8 sm:w-10/12">
					<div className="flex items-center space-x-2">
						<Users className="w-5 h-5 text-b" />
						<span className="text-b">Up to {suite.capacity} guests</span>
					</div>
					<div className="text-3xl font-young-med text-a">
						₱{Number(suite.pricePerNight).toLocaleString()}
						<span className="text-sm text-c">/night</span>
					</div>
				</div>

				<div className="mb-8 w-full">
					<div className="grid sm:grid-cols-4 gap-2">
						{suite.amenities.slice(0, 4).map((amenity, index) => (
							<div key={index} className="flex items-center justify-center space-x-2 text-b">
								{getAmenityIcon(amenity)}
								<span className="text-sm">{amenity}</span>
							</div>
						))}
					</div>
				</div>

				<button
					onClick={() => onBook(suite)}
					className="w-full bg-amber-400 hover:bg-amber-500 py-3 text-g hover:text-b rounded-lg font-young-med transition-all text-xl"
				>
					Book Now
				</button>
			</div>
		</AnimatedDiv>
	);
};

export default SuiteCard;
