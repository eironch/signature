import { User, Suite, Booking } from "../models/associations.js";
import { Op } from "sequelize";
import moment from "moment";
import sql from "../config/database.js";

const getDashboard = async (req, res, next) => {
	try {
		// Get booking statistics
		const totalBookings = await Booking.count();
		const activeBookings = await Booking.count({
			where: { status: ["pending", "confirmed"] },
		});
		const totalRevenue = await Booking.sum("totalPrice", {
			where: { paymentStatus: "paid" },
		});

		// Get today's bookings
		const today = moment().format("YYYY-MM-DD");
		const todayBookings = await Booking.findAll({
			where: {
				[Op.or]: [
					{ checkInDate: today },
					{
						checkInDate: { [Op.lte]: today },
						checkOutDate: { [Op.gt]: today },
					},
				],
				status: ["confirmed", "pending"],
			},
			include: [
				{ model: Suite, as: "suite" },
				{ model: User, as: "user" },
			],
			limit: 10,
		});
		// Get suite occupancy
		const suites = await Suite.findAll();
		const suiteOccupancy = await Promise.all(
			suites.map(async (suite) => {
				const occupiedToday = await Booking.getBookingsByDateAndSuite(today, suite.id);
				return {
					suiteId: suite.id,
					suiteName: suite.name,
					type: suite.type,
					occupied: occupiedToday,
					total: suite.dailyBookingLimit,
					percentage: (occupiedToday / suite.dailyBookingLimit) * 100,
				};
			})
		);

		res.json({
			success: true,
			dashboard: {
				totalBookings,
				activeBookings,
				totalRevenue: totalRevenue || 0,
				todayBookings,
				suiteOccupancy,
			},
		});
	} catch (error) {
		next(error);
	}
};

const getAllBookings = async (req, res, next) => {
	try {
		const { status, suiteId, startDate, endDate, page = 1, limit = 20 } = req.query;
		const where = {};

		if (status) where.status = status;
		if (suiteId) where.suiteId = suiteId;
		if (startDate && endDate) {
			where.checkInDate = {
				[Op.between]: [startDate, endDate],
			};
		}

		const offset = (page - 1) * limit;

		const { count, rows } = await Booking.findAndCountAll({
			where,
			include: [
				{ model: Suite, as: "suite" },
				{ model: User, as: "user" },
			],
			order: [["createdAt", "DESC"]],
			limit: parseInt(limit),
			offset,
		});

		res.json({
			success: true,
			bookings: rows,
			totalPages: Math.ceil(count / limit),
			currentPage: parseInt(page),
			totalBookings: count,
		});
	} catch (error) {
		next(error);
	}
};

const updateSuiteLimit = async (req, res, next) => {
	try {
		const { suiteId } = req.params;
		const { dailyBookingLimit } = req.body;

		const suite = await Suite.findByPk(suiteId);
		if (!suite) {
			return res.status(404).json({ error: "Suite not found" });
		}

		await suite.update({ dailyBookingLimit });

		res.json({
			success: true,
			suite,
		});
	} catch (error) {
		next(error);
	}
};

const getBookingStats = async (req, res, next) => {
	try {
		const { period = "month" } = req.query;

		let startDate;
		if (period === "week") {
			startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
		} else if (period === "month") {
			startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
		} else {
			startDate = moment().subtract(1, "year").format("YYYY-MM-DD");
		}

		// Get booking trends
		const bookingTrends = await Booking.findAll({
			attributes: [
				[sql.fn("DATE", sql.col("createdAt")), "date"],
				[sql.fn("COUNT", sql.col("id")), "count"],
				[sql.fn("SUM", sql.col("totalPrice")), "revenue"],
			],
			where: {
				createdAt: { [Op.gte]: startDate },
			},
			group: [sql.fn("DATE", sql.col("createdAt"))],
			order: [[sql.fn("DATE", sql.col("createdAt")), "ASC"]],
		});

		// Get suite popularity
		const suitePopularity = await Booking.findAll({
			attributes: ["suiteId", [sql.fn("COUNT", sql.col("Booking.id")), "bookingCount"]],
			include: [
				{
					model: Suite,
					as: "suite",
					attributes: ["name", "type"],
				},
			],
			where: {
				createdAt: { [Op.gte]: startDate },
			},
			group: ["suiteId", "suite.id", "suite.name", "suite.type"],
			order: [[sql.fn("COUNT", sql.col("Booking.id")), "DESC"]],
			raw: true,
			nest: true,
		});

		res.json({
			success: true,
			stats: {
				bookingTrends,
				suitePopularity,
			},
		});
	} catch (error) {
		next(error);
	}
};

export { getDashboard, getAllBookings, updateSuiteLimit, getBookingStats };
