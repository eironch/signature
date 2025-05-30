import express from "express";
import { body } from "express-validator";
import { register, login, getMe, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
	"/register",
	[
		body("email").isEmail().normalizeEmail(),
		body("username").isLength({ min: 3 }).trim(),
		body("password").isLength({ min: 6 }),
	],
	register
);

router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
