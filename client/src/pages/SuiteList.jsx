import { useState, useEffect } from "react";
import useStore from "../stores/useStore";
import AnimatedDiv from "../components/AnimatedDiv";
import SuiteCard from "../components/SuiteCard";
import BookingModal from "../components/BookingModal";

const SuiteList = () => {
	const { suites, fetchSuites } = useStore();
	const [selectedSuite, setSelectedSuite] = useState(null);
	const [showBookingModal, setShowBookingModal] = useState(false);

	useEffect(() => {
		fetchSuites();
	}, []);

	const handleBook = (suite) => {
		setSelectedSuite(suite);
		setShowBookingModal(true);
	};

	return (
		<div className="p-6">
			<AnimatedDiv>
				<h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Luxury Suites</h1>
			</AnimatedDiv>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{suites.map((suite, index) => (
					<SuiteCard key={suite.id} suite={suite} onBook={handleBook} />
				))}
			</div>

			{showBookingModal && selectedSuite && (
				<BookingModal
					suite={selectedSuite}
					onClose={() => setShowBookingModal(false)}
					onConfirm={() => fetchSuites()}
				/>
			)}
		</div>
	);
};

export default SuiteList;
