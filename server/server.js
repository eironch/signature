import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import suiteRoutes from "./routes/suiteRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { User, Suite, Booking } from "./models/associations.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/suites", suiteRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_, res) => {
	res.json("good mourning.");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
	try {
		await sql.authenticate();
		console.log("Database connected successfully");

		// Sync models
		// if (process.env.ENV != "production") await sql.sync({ alter: true });
		console.log("Database synced");

		// Initialize default suites
		await Suite.initializeDefaultSuites();

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Unable to connect to database:", error);
	}
};

startServer();
