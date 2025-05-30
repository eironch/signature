import User from "./User.js";
import Suite from "./Suite.js";
import Booking from "./Booking.js";

User.hasMany(Booking, {
	foreignKey: "userId",
	as: "bookings",
});

Booking.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
});

Suite.hasMany(Booking, {
	foreignKey: "suiteId",
	as: "bookings",
});

Booking.belongsTo(Suite, {
	foreignKey: "suiteId",
	as: "suite",
});

export { User, Suite, Booking };
