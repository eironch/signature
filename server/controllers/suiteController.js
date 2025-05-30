import { Suite, Booking } from "../models/associations.js";
import moment from "moment";

const getAllSuites = async (req, res, next) => {
	try {
		const suites = await Suite.findAll({
			where: { isAvailable: true },
		});

		res.json({
			success: true,
			suites,
		});
	} catch (error) {
		next(error);
	}
};

const getSuiteById = async (req, res, next) => {
	try {
		const suite = await Suite.findByPk(req.params.id);

		if (!suite) {
			return res.status(404).json({ error: "Suite not found" });
		}

		res.json({
			success: true,
			suite,
		});
	} catch (error) {
		next(error);
	}
};

const checkAvailability = async (req, res, next) => {
	try {
		const { suiteId, checkInDate, checkOutDate } = req.query;

		if (!suiteId || !checkInDate || !checkOutDate) {
			return res.status(400).json({ error: "Missing required parameters" });
		}

		const suite = await Suite.findByPk(suiteId);
		if (!suite) {
			return res.status(404).json({ error: "Suite not found" });
		}

		// Check if dates are within booking limits
		const checkIn = moment(checkInDate);
		const checkOut = moment(checkOutDate);
		const dates = [];

		for (let date = checkIn.clone(); date.isBefore(checkOut); date.add(1, "days")) {
			dates.push(date.format("YYYY-MM-DD"));
		}

		// Check daily booking limits
		let isAvailable = true;
		const availability = [];

		for (const date of dates) {
			const bookingsCount = await Booking.getBookingsByDateAndSuite(date, suiteId);
			const available = bookingsCount < suite.dailyBookingLimit;

			availability.push({
				date,
				available,
				bookingsCount,
				limit: suite.dailyBookingLimit,
			});

			if (!available) {
				isAvailable = false;
			}
		}

		res.json({
			success: true,
			isAvailable,
			availability,
			suite: {
				id: suite.id,
				name: suite.name,
				pricePerNight: suite.pricePerNight,
			},
		});
	} catch (error) {
		next(error);
	}
};

export { getAllSuites, getSuiteById, checkAvailability };
