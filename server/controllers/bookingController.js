import { User, Suite, Booking } from "../models/associations.js";
import { Op } from "sequelize";
import moment from "moment";

const createBooking = async (req, res, next) => {
	try {
		const { suiteId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

		// Validate dates
		const checkIn = moment(checkInDate);
		const checkOut = moment(checkOutDate);

		if (checkIn.isBefore(moment().startOf("day"))) {
			return res.status(400).json({ error: "Check-in date cannot be in the past" });
		}

		if (checkOut.isSameOrBefore(checkIn)) {
			return res.status(400).json({ error: "Check-out date must be after check-in date" });
		}

		// Check suite exists
		const suite = await Suite.findByPk(suiteId);
		if (!suite || !suite.isAvailable) {
			return res.status(404).json({ error: "Suite not found or unavailable" });
		}

		// Check availability
		const isAvailable = await Booking.checkAvailability(suiteId, checkInDate, checkOutDate);
		if (!isAvailable) {
			return res.status(400).json({ error: "Suite is not available for selected dates" });
		}

		// Check daily limits
		const dates = [];
		for (let date = checkIn.clone(); date.isBefore(checkOut); date.add(1, "days")) {
			dates.push(date.format("YYYY-MM-DD"));
		}

		for (const date of dates) {
			const bookingsCount = await Booking.getBookingsByDateAndSuite(date, suiteId);
			if (bookingsCount >= suite.dailyBookingLimit) {
				return res.status(400).json({
					error: `Booking limit reached for ${date}. Maximum ${suite.dailyBookingLimit} bookings allowed per day.`,
				});
			}
		}

		// Calculate total price
		const nights = checkOut.diff(checkIn, "days");
		const totalPrice = nights * suite.pricePerNight;

		// Create booking
		const booking = await Booking.create({
			userId: req.user.id,
			suiteId,
			checkInDate,
			checkOutDate,
			numberOfGuests,
			totalPrice,
			specialRequests,
			status: "confirmed",
		});

		// Fetch complete booking with associations
		const completeBooking = await Booking.findByPk(booking.id, {
			include: [
				{ model: Suite, as: "suite" },
				{ model: User, as: "user" },
			],
		});

		res.status(201).json({
			success: true,
			booking: completeBooking,
		});
	} catch (error) {
		next(error);
	}
};

const getUserBookings = async (req, res, next) => {
	try {
		const { status } = req.query;
		const where = { userId: req.user.id };

		if (status === "current") {
			where.checkOutDate = { [Op.gte]: moment().format("YYYY-MM-DD") };
			where.status = ["confirmed", "pending"];
		} else if (status === "past") {
			where[Op.or] = [
				{ checkOutDate: { [Op.lt]: moment().format("YYYY-MM-DD") } },
				{ status: "completed" },
			];
		}

		const bookings = await Booking.findAll({
			where,
			include: [{ model: Suite, as: "suite" }],
			order: [["createdAt", "DESC"]],
		});

		res.json({
			success: true,
			bookings,
		});
	} catch (error) {
		next(error);
	}
};

const getBookingById = async (req, res, next) => {
	try {
		const booking = await Booking.findOne({
			where: {
				id: req.params.id,
				userId: req.user.id,
			},
			include: [{ model: Suite, as: "suite" }],
		});

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		res.json({
			success: true,
			booking,
		});
	} catch (error) {
		next(error);
	}
};

const cancelBooking = async (req, res, next) => {
	try {
		const booking = await Booking.findOne({
			where: {
				id: req.params.id,
				userId: req.user.id,
				status: ["pending", "confirmed"],
			},
		});

		if (!booking) {
			return res.status(404).json({ error: "Booking not found or cannot be cancelled" });
		}

		// Check if check-in date has passed
		if (moment(booking.checkInDate).isBefore(moment().startOf("day"))) {
			return res.status(400).json({ error: "Cannot cancel past bookings" });
		}

		await booking.update({ status: "cancelled" });

		res.json({
			success: true,
			message: "Booking cancelled successfully",
			booking,
		});
	} catch (error) {
		next(error);
	}
};

export { createBooking, getUserBookings, getBookingById, cancelBooking };
