import { useState, useEffect } from "react";
import useStore from "../stores/useStore";
import { Users, CalendarDays, CreditCard } from "lucide-react";
import AnimatedDiv from "../components/AnimatedDiv";

const AdminDashboard = () => {
	const { adminStats, fetchAdminDashboard } = useStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDashboard();
	}, []);

	const loadDashboard = async () => {
		try {
			await fetchAdminDashboard();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-b font-young text-xl">Loading dashboard...</p>
			</div>
		);
	}

	if (!adminStats) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-b font-young text-xl">Failed to load dashboard</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen h-full flex justify-center w-full overflow-auto font-young">
			<div className="py-12 flex-col flex w-9/12 overflow-x-hidden">
				<AnimatedDiv>
					<h1 className="text-4xl font-bold text-a mb-8 font-young-med">Admin Dashboard</h1>
				</AnimatedDiv>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<AnimatedDiv delay={100} className="bg-c rounded-xl shadow-lg p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-f">Total Bookings</p>
								<p className="text-3xl font-bold text-g">{adminStats.totalBookings}</p>
							</div>
							<CalendarDays className="w-12 h-12 text-amber-400" />
						</div>
					</AnimatedDiv>

					<AnimatedDiv delay={200} className="bg-c rounded-xl shadow-lg p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-f">Active Bookings</p>
								<p className="text-3xl font-bold text-g">{adminStats.activeBookings}</p>
							</div>
							<Users className="w-12 h-12 text-green-400" />
						</div>
					</AnimatedDiv>

					<AnimatedDiv delay={300} className="bg-c rounded-xl shadow-lg p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-f">Total Revenue</p>
								<p className="text-3xl font-bold text-g">
									₱{adminStats.totalRevenue.toLocaleString()}
								</p>
							</div>
							<CreditCard className="w-12 h-12 text-blue-400" />
						</div>
					</AnimatedDiv>
				</div>

				<AnimatedDiv delay={400}>
					<h2 className="text-2xl font-semibold text-a mb-4 font-young-med">Suite Occupancy</h2>
					<div className="bg-c rounded-xl shadow-lg p-6 mb-8">
						<div className="space-y-4">
							{adminStats.suiteOccupancy.map((suite) => (
								<div key={suite.suiteId} className="flex items-center justify-between">
									<div className="flex-1">
										<p className="font-semibold text-gray-800">{suite.suiteName}</p>
										<p className="text-sm text-gray-600">
											{suite.occupied} / {suite.total} occupied
										</p>
									</div>
									<div className="w-1/2">
										<div className="bg-gray-200 rounded-full h-4 overflow-hidden">
											<div
												className="bg-gradient-to-r from-amber-400 to-amber-400 h-full transition-all duration-1000"
												style={{ width: `${suite.percentage}%` }}
											/>
										</div>
									</div>
									<span className="ml-4 font-semibold text-gray-700">
										{Math.round(suite.percentage)}%
									</span>
								</div>
							))}
						</div>
					</div>
				</AnimatedDiv>

				<AnimatedDiv delay={500}>
					<h2 className="text-2xl font-semibold text-a mb-4 font-young-med">
						Today&apos;s Bookings
					</h2>
					<div className="bg-b rounded-xl shadow-lg overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-c">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-young-med text-f uppercase tracking-wider">
											Booking Code
										</th>
										<th className="px-6 py-3 text-left text-xs font-young-med text-f uppercase tracking-wider">
											Guest
										</th>
										<th className="px-6 py-3 text-left text-xs font-young-med text-f uppercase tracking-wider">
											Suite
										</th>
										<th className="px-6 py-3 text-left text-xs font-young-med text-f uppercase tracking-wider">
											Check-in
										</th>
										<th className="px-6 py-3 text-left text-xs font-young-med text-f uppercase tracking-wider">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="bg-b divide-y divide-gray-200">
									{adminStats.todayBookings.map((booking) => (
										<tr key={booking.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-young-med text-g">
												{booking.bookingCode}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-f">
												{booking.user.firstName} {booking.user.lastName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-f">
												{booking.suite.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-f">
												{new Date(booking.checkInDate).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 text-xs rounded-full font-semibold ${
														booking.status === "confirmed"
															? "bg-green-200 text-green-700"
															: "bg-yellow-200 text-yellow-700"
													}`}
												>
													{booking.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</AnimatedDiv>
			</div>
		</div>
	);
};

export default AdminDashboard;
