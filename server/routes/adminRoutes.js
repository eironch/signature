import express from "express";
import {
	getDashboard,
	getAllBookings,
	updateSuiteLimit,
	getBookingStats,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin); // All admin routes require authentication and admin role

router.get("/dashboard", getDashboard);
router.get("/bookings", getAllBookings);
router.get("/stats", getBookingStats);
router.put("/suites/:suiteId/limit", updateSuiteLimit);

export default router;
