import { useState, useEffect } from "react";
import useStore from "../stores/useStore";
import AnimatedDiv from "../components/AnimatedDiv";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
	const {
		user,
		logout,
		fetchUserBookings,
		currentBookings,
		pastBookings,
		cancelBooking,
		fetchProfile,
	} = useStore();
	const [activeTab, setActiveTab] = useState("current");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		loadBookings();
		fetchProfile();
	}, []);

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

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
		<div className="py-12 w-full min-h-screen bg-g">
			<div className="w-9/12 mx-auto font-young">
				<AnimatedDiv className="flex justify-between">
					<h1 className="text-4xl font-bold text-a mb-8 font-young-med">My Profile</h1>
					<button
						onClick={handleLogout}
						className="flex items-center space-x-2 bg-red-500 h-fit text-white px-6 py-4 rounded-lg hover:bg-red-800 transition-all"
					>
						<LogOut className="w-4 h-4" />
						<span>Logout</span>
					</button>
				</AnimatedDiv>

				{user && (
					<AnimatedDiv delay={100} className="bg-c rounded-xl shadow-lg p-6 mb-8">
						<h2 className="text-2xl font-semibold text-g mb-8">Account Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<p className="text-f">Name</p>
								<p className="text-g font-semibold">
									{user.firstName} {user.lastName}
								</p>
							</div>
							<div>
								<p className="text-f">Email</p>
								<p className="text-g font-semibold">{user.email}</p>
							</div>
							<div>
								<p className="text-f">Username</p>
								<p className="text-g font-semibold">{user.username}</p>
							</div>
							<div>
								<p className="text-f">Phone</p>
								<p className="text-g font-semibold">{user.phone || "Not provided"}</p>
							</div>
						</div>
					</AnimatedDiv>
				)}

				<AnimatedDiv delay={200}>
					<div className="flex space-x-4 mb-8">
						<button
							onClick={() => setActiveTab("current")}
							className={`px-6 py-3 rounded-lg font-semibold transition-all ${
								activeTab === "current" ? "bg-amber-400 text-g" : "bg-b text-g hover:bg-c"
							}`}
						>
							Current Bookings
						</button>
					</div>
				</AnimatedDiv>

				{loading ? (
					<div className="text-center py-8">
						<p className="text-b text-xl">Loading bookings...</p>
					</div>
				) : bookings.length === 0 ? (
					<AnimatedDiv delay={300} className="bg-c rounded-xl shadow-lg p-8 text-center">
						<p className="text-g">No {activeTab} bookings found</p>
					</AnimatedDiv>
				) : (
					<div className="space-y-4">
						{bookings.map((booking, index) => (
							<AnimatedDiv
								key={booking.id}
								delay={300 + index * 100}
								className="bg-d rounded-xl shadow-lg p-6"
							>
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-b mb-2">{booking.suite?.name}</h3>
										<p className="text-g mb-1">
											Booking Code: <span className="font-semibold">{booking.bookingCode}</span>
										</p>
										<p className="text-g mb-1">
											Check-in:{" "}
											<span className="font-semibold">
												{new Date(booking.checkInDate).toLocaleDateString()}
											</span>
										</p>
										<p className="text-g mb-1">
											Check-out:{" "}
											<span className="font-semibold">
												{new Date(booking.checkOutDate).toLocaleDateString()}
											</span>
										</p>
										<p className="text-g">
											Total:{" "}
											<span className="font-semibold text-b">
												₱{Number(booking.totalPrice).toLocaleString()}
											</span>
										</p>
									</div>

									<div className="flex flex-col space-y-2">
										<span
											className={`px-3 py-1 rounded-full text-sm font-semibold ${
												booking.status === "confirmed"
													? "bg-green-200 text-green-700"
													: booking.status === "cancelled"
													? "bg-red-200 text-red-700"
													: booking.status === "completed"
													? "bg-blue-200 text-blue-700"
													: "bg-yellow-100 text-yellow-700"
											}`}
										>
											{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
										</span>

										{activeTab === "current" && booking.status === "confirmed" && (
											<button
												onClick={() => handleCancel(booking.id)}
												className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-all"
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
		</div>
	);
};

export default UserProfile;
