import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sql from "../config/database.js";

const User = sql.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.ENUM("user", "admin"),
			defaultValue: "user",
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed("password")) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
		},
	}
);

// Instance methods
User.prototype.validatePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function () {
	const values = Object.assign({}, this.get());
	delete values.password;
	return values;
};

export default User;
