import { DataTypes } from "sequelize";
import sql from "../config/database.js";

const Suite = sql.define("Suite", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	type: {
		type: DataTypes.ENUM("standard", "deluxe", "presidential"),
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
	},
	capacity: {
		type: DataTypes.INTEGER,
		defaultValue: 2,
	},
	pricePerNight: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false,
	},
	amenities: {
		type: DataTypes.JSON,
		defaultValue: [],
	},
	images: {
		type: DataTypes.JSON,
		defaultValue: [],
	},
	totalRooms: {
		type: DataTypes.INTEGER,
		defaultValue: 10,
	},
	dailyBookingLimit: {
		type: DataTypes.INTEGER,
		defaultValue: 5,
	},
	isAvailable: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
});

// Static methods
Suite.initializeDefaultSuites = async function () {
	const count = await this.count();
	if (count === 0) {
		await this.bulkCreate([
			{
				name: "Standard Suite",
				type: "standard",
				description: "Comfortable and affordable suite with modern amenities",
				capacity: 2,
				pricePerNight: 5000,
				amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar"],
				totalRooms: 20,
				dailyBookingLimit: 15,
			},
			{
				name: "Deluxe Suite",
				type: "deluxe",
				description: "Spacious suite with premium furnishings and city view",
				capacity: 4,
				pricePerNight: 8000,
				amenities: [
					"Free WiFi",
					"Air Conditioning",
					"Smart TV",
					"Mini Bar",
					"Work Desk",
					"Room Service",
				],
				totalRooms: 15,
				dailyBookingLimit: 10,
			},
			{
				name: "Presidential Suite",
				type: "presidential",
				description: "Luxurious suite with panoramic views and exclusive services",
				capacity: 6,
				pricePerNight: 15000,
				amenities: [
					"Free WiFi",
					"Air Conditioning",
					"Smart TV",
					"Full Bar",
					"Kitchen",
					"Butler Service",
					"Jacuzzi",
					"Private Balcony",
				],
				totalRooms: 5,
				dailyBookingLimit: 3,
			},
		]);
		console.log("Default suites created");
	}
};

export default Suite;
