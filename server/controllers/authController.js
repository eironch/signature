import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { User, Booking, Suite } from "../models/associations.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

const register = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, username, password, firstName, lastName, phone } = req.body;

		const user = await User.create({
			email,
			username,
			password,
			firstName,
			lastName,
			phone,
		});

		const token = generateToken(user.id);

		res.status(201).json({
			success: true,
			token,
			user,
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { emailOrUsername, password } = req.body;

		const user = await User.findOne({
			where: {
				[Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
			},
		});

		if (!user || !(await user.validatePassword(password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		if (!user.isActive) {
			return res.status(401).json({ error: "Account is deactivated" });
		}

		const token = generateToken(user.id);

		res.json({
			success: true,
			token,
			user,
		});
	} catch (error) {
		next(error);
	}
};

const getMe = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.id, {
			include: [
				{
					model: Booking,
					as: "bookings",
					include: [{ model: Suite, as: "suite" }],
				},
			],
		});

		res.json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

const updateProfile = async (req, res, next) => {
	try {
		const { firstName, lastName, phone } = req.body;

		await req.user.update({
			firstName,
			lastName,
			phone,
		});

		res.json({
			success: true,
			user: req.user,
		});
	} catch (error) {
		next(error);
	}
};

export { register, login, getMe, updateProfile };
