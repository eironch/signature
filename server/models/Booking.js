import { DataTypes } from "sequelize";
import { Op } from "sequelize";
import moment from "moment";
import sql from "../config/database.js";

const Booking = sql.define(
	"Booking",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		suiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Suites",
				key: "id",
			},
		},
		bookingCode: {
			type: DataTypes.STRING,
			unique: true,
		},
		checkInDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		checkOutDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		numberOfGuests: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		totalPrice: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
			defaultValue: "pending",
		},
		specialRequests: {
			type: DataTypes.TEXT,
		},
		paymentStatus: {
			type: DataTypes.ENUM("pending", "paid", "refunded"),
			defaultValue: "pending",
		},
	},
	{
		hooks: {
			beforeCreate: (booking) => {
				booking.bookingCode = "BK" + Date.now().toString(36).toUpperCase();
			},
		},
	}
);

// Instance methods
Booking.prototype.calculateTotalPrice = function (pricePerNight) {
	const checkIn = moment(this.checkInDate);
	const checkOut = moment(this.checkOutDate);
	const nights = checkOut.diff(checkIn, "days");
	return nights * pricePerNight;
};

// Static methods
Booking.getBookingsByDateAndSuite = async function (date, suiteId) {
	return await this.count({
		where: {
			suiteId,
			status: ["pending", "confirmed"],
			checkInDate: {
				[Op.lte]: date,
			},
			checkOutDate: {
				[Op.gt]: date,
			},
		},
	});
};

Booking.checkAvailability = async function (suiteId, checkInDate, checkOutDate, bookingId = null) {
	const whereClause = {
		suiteId,
		status: ["pending", "confirmed"],
		[Op.or]: [
			{
				checkInDate: {
					[Op.between]: [checkInDate, checkOutDate],
				},
			},
			{
				checkOutDate: {
					[Op.between]: [checkInDate, checkOutDate],
				},
			},
			{
				[Op.and]: [
					{
						checkInDate: {
							[Op.lte]: checkInDate,
						},
					},
					{
						checkOutDate: {
							[Op.gte]: checkOutDate,
						},
					},
				],
			},
		],
	};

	if (bookingId) {
		whereClause.id = { [Op.ne]: bookingId };
	}

	const conflictingBookings = await this.count({ where: whereClause });
	return conflictingBookings === 0;
};

export default Booking;
