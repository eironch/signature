import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({ error: "Not authorized" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findByPk(decoded.id);

		if (!req.user) {
			return res.status(401).json({ error: "User not found" });
		}

		next();
	} catch (error) {
		return res.status(401).json({ error: "Not authorized" });
	}
};

const admin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ error: "Admin access required" });
	}
};

export { protect, admin };
