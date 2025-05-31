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
		<AnimatedDiv className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-950 font-young ">
			<div className="h-80 bg-f flex items-center justify-center relative">
				<img className="absolute inset-0 z-0" src={suiteImages[suite.id - 1]} />
				<div className="absolute -inset-60 bg-g/30"></div>
				<div className="z-10 relative">
					<h3 className="text-7xl font-bold text-center text-amber-400 mb-4">{suite.name}</h3>
					<p className="text-b text-xl">{suite.description}</p>
				</div>
			</div>

			<div className="relative p-6 z-10 bg-gradient-to-b to-40% to-g/60">
				<div className="flex items-center justify-between mb-8 px-24">
					<div className="flex items-center space-x-2">
						<Users className="w-5 h-5 text-b" />
						<span className="text-b">Up to {suite.capacity} guests</span>
					</div>
					<div className="text-3xl font-young-med text-a">
						₱{Number(suite.pricePerNight).toLocaleString()}
						<span className="text-sm text-c">/night</span>
					</div>
				</div>

				<div className="mb-12">
					<div className="grid grid-cols-4 gap-2">
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
					className="w-full bg-amber-400 hover:bg-amber-500 py-3 text-g hover:text-b rounded-lg font-young-med  transition-all text-xl"
				>
					Book Now
				</button>
			</div>
		</AnimatedDiv>
	);
};

export default SuiteCard;
