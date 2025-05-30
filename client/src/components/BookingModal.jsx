import { useState } from "react";
import AnimatedDiv from "./AnimatedDiv";
import useStore from "../stores/useStore";
import { X } from "lucide-react";

const BookingModal = ({ suite, onClose, onConfirm }) => {
	const [bookingData, setBookingData] = useState({
		checkInDate: "",
		checkOutDate: "",
		numberOfGuests: 1,
		specialRequests: "",
	});
	const [availability, setAvailability] = useState(null);
	const [checking, setChecking] = useState(false);

	const { checkAvailability, createBooking, loading } = useStore();

	const handleCheckAvailability = async () => {
		if (!bookingData.checkInDate || !bookingData.checkOutDate) {
			alert("Please select check-in and check-out dates");
			return;
		}

		setChecking(true);
		try {
			const result = await checkAvailability(
				suite.id,
				bookingData.checkInDate,
				bookingData.checkOutDate
			);
			setAvailability(result);
		} catch (error) {
			alert(error.message);
		} finally {
			setChecking(false);
		}
	};

	const handleBooking = async () => {
		try {
			const booking = await createBooking({
				suiteId: suite.id,
				...bookingData,
			});
			alert("Booking confirmed! Booking code: " + booking.bookingCode);
			onConfirm();
			onClose();
		} catch (error) {
			alert(error.message);
		}
	};

	const calculateTotal = () => {
		if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
		const checkIn = new Date(bookingData.checkInDate);
		const checkOut = new Date(bookingData.checkOutDate);
		const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
		return nights * Number(suite.pricePerNight);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<AnimatedDiv className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<h2 className="text-2xl font-bold text-gray-800">Book {suite.name}</h2>
						<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
							<X className="w-6 h-6" />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
							<input
								type="date"
								min={new Date().toISOString().split("T")[0]}
								value={bookingData.checkInDate}
								onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
							<input
								type="date"
								min={bookingData.checkInDate || new Date().toISOString().split("T")[0]}
								value={bookingData.checkOutDate}
								onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
							<select
								value={bookingData.numberOfGuests}
								onChange={(e) =>
									setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })
								}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
							>
								{[...Array(suite.capacity)].map((_, i) => (
									<option key={i + 1} value={i + 1}>
										{i + 1} Guest{i > 0 ? "s" : ""}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-2">Special Requests</label>
							<textarea
								value={bookingData.specialRequests}
								onChange={(e) =>
									setBookingData({ ...bookingData, specialRequests: e.target.value })
								}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
								rows="3"
								placeholder="Any special requests..."
							/>
						</div>

						{bookingData.checkInDate && bookingData.checkOutDate && (
							<div className="bg-orange-50 p-4 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="font-semibold text-gray-700">Total Amount:</span>
									<span className="text-2xl font-bold text-orange-600">
										₱{calculateTotal().toLocaleString()}
									</span>
								</div>
							</div>
						)}

						{availability && (
							<div
								className={`p-4 rounded-lg ${
									availability.isAvailable ? "bg-green-50" : "bg-red-50"
								}`}
							>
								<p
									className={`font-semibold ${
										availability.isAvailable ? "text-green-700" : "text-red-700"
									}`}
								>
									{availability.isAvailable
										? "✓ Suite is available for selected dates"
										: "✗ Suite is not available for selected dates"}
								</p>
							</div>
						)}

						<div className="flex space-x-3">
							<button
								onClick={handleCheckAvailability}
								disabled={checking || !bookingData.checkInDate || !bookingData.checkOutDate}
								className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
							>
								{checking ? "Checking..." : "Check Availability"}
							</button>

							<button
								onClick={handleBooking}
								disabled={loading || !availability?.isAvailable}
								className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-amber-500 transition-all disabled:opacity-50"
							>
								{loading ? "Booking..." : "Confirm Booking"}
							</button>
						</div>
					</div>
				</div>
			</AnimatedDiv>
		</div>
	);
};

export default BookingModal;
