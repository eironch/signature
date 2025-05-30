import { useState, useEffect } from "react";
import useStore from "../stores/useStore";
import AnimatedDiv from "../components/AnimatedDiv";

const UserProfile = () => {
	const { user, fetchUserBookings, currentBookings, pastBookings, cancelBooking, fetchProfile } =
		useStore();
	const [activeTab, setActiveTab] = useState("current");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadBookings();
		fetchProfile();
	}, []);

	const loadBookings = async () => {
		setLoading(true);
		try {
			await Promise.all([fetchUserBookings("current"), fetchUserBookings("past")]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = async (bookingId) => {
		if (window.confirm("Are you sure you want to cancel this booking?")) {
			try {
				await cancelBooking(bookingId);
				alert("Booking cancelled successfully");
				loadBookings();
			} catch (error) {
				alert(error.message);
			}
		}
	};

	const bookings = activeTab === "current" ? currentBookings : pastBookings;

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<AnimatedDiv>
				<h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>
			</AnimatedDiv>

			{user && (
				<AnimatedDiv delay={100} className="bg-white rounded-xl shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-gray-600">Name</p>
							<p className="font-semibold">
								{user.firstName} {user.lastName}
							</p>
						</div>
						<div>
							<p className="text-gray-600">Email</p>
							<p className="font-semibold">{user.email}</p>
						</div>
						<div>
							<p className="text-gray-600">Username</p>
							<p className="font-semibold">{user.username}</p>
						</div>
						<div>
							<p className="text-gray-600">Phone</p>
							<p className="font-semibold">{user.phone || "Not provided"}</p>
						</div>
					</div>
				</AnimatedDiv>
			)}

			<AnimatedDiv delay={200}>
				<div className="flex space-x-4 mb-6">
					<button
						onClick={() => setActiveTab("current")}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							activeTab === "current"
								? "bg-orange-400 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Current Bookings
					</button>
					<button
						onClick={() => setActiveTab("past")}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							activeTab === "past"
								? "bg-orange-400 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Past Bookings
					</button>
				</div>
			</AnimatedDiv>

			{loading ? (
				<div className="text-center py-8">
					<p className="text-gray-600">Loading bookings...</p>
				</div>
			) : bookings.length === 0 ? (
				<AnimatedDiv delay={300} className="bg-white rounded-xl shadow-lg p-8 text-center">
					<p className="text-gray-600">No {activeTab} bookings found</p>
				</AnimatedDiv>
			) : (
				<div className="space-y-4">
					{bookings.map((booking, index) => (
						<AnimatedDiv
							key={booking.id}
							delay={300 + index * 100}
							className="bg-white rounded-xl shadow-lg p-6"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										{booking.suite?.name}
									</h3>
									<p className="text-gray-600 mb-1">
										Booking Code: <span className="font-semibold">{booking.bookingCode}</span>
									</p>
									<p className="text-gray-600 mb-1">
										Check-in:{" "}
										<span className="font-semibold">
											{new Date(booking.checkInDate).toLocaleDateString()}
										</span>
									</p>
									<p className="text-gray-600 mb-1">
										Check-out:{" "}
										<span className="font-semibold">
											{new Date(booking.checkOutDate).toLocaleDateString()}
										</span>
									</p>
									<p className="text-gray-600">
										Total:{" "}
										<span className="font-semibold text-orange-600">
											₱{Number(booking.totalPrice).toLocaleString()}
										</span>
									</p>
								</div>

								<div className="flex flex-col space-y-2">
									<span
										className={`px-3 py-1 rounded-full text-sm font-semibold ${
											booking.status === "confirmed"
												? "bg-green-100 text-green-700"
												: booking.status === "cancelled"
												? "bg-red-100 text-red-700"
												: booking.status === "completed"
												? "bg-blue-100 text-blue-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
									</span>

									{activeTab === "current" && booking.status === "confirmed" && (
										<button
											onClick={() => handleCancel(booking.id)}
											className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
										>
											Cancel
										</button>
									)}
								</div>
							</div>
						</AnimatedDiv>
					))}
				</div>
			)}
		</div>
	);
};

export default UserProfile;
