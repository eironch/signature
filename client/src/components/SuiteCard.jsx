import { Wifi, Tv, Coffee, Star, Users } from "lucide-react";
import AnimatedDiv from "./AnimatedDiv";

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

	return (
		<AnimatedDiv className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
			<div className="h-48 bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center">
				<h3 className="text-3xl font-bold text-white">{suite.name}</h3>
			</div>

			<div className="p-6">
				<p className="text-gray-600 mb-4">{suite.description}</p>

				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-2">
						<Users className="w-5 h-5 text-gray-500" />
						<span className="text-gray-600">Up to {suite.capacity} guests</span>
					</div>
					<div className="text-2xl font-bold text-orange-600">
						₱{Number(suite.pricePerNight).toLocaleString()}
						<span className="text-sm text-gray-500">/night</span>
					</div>
				</div>

				<div className="mb-4">
					<h4 className="font-semibold text-gray-700 mb-2">Amenities</h4>
					<div className="grid grid-cols-2 gap-2">
						{suite.amenities.slice(0, 4).map((amenity, index) => (
							<div key={index} className="flex items-center space-x-2 text-gray-600">
								{getAmenityIcon(amenity)}
								<span className="text-sm">{amenity}</span>
							</div>
						))}
					</div>
				</div>

				<button
					onClick={() => onBook(suite)}
					className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-amber-500 transition-all"
				>
					Book Now
				</button>
			</div>
		</AnimatedDiv>
	);
};

export default SuiteCard;
