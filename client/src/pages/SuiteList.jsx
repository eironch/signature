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
		<div className="py-12 flex items-center flex-col">
			<AnimatedDiv>
				<h1 className="text-4xl font-bold text-b mb-8 text-center font-young-med">Luxury Suites</h1>
			</AnimatedDiv>

			<div className="flex flex-col gap-12 w-10/12">
				{suites.map((suite) => (
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
