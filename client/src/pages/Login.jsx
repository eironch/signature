import { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import useStore from "../stores/useStore";
import AnimatedDiv from "../components/AnimatedDiv";
import BGImage from "../assets/bg.png";

const Login = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		emailOrUsername: "",
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		phone: "",
	});

	const { login, register, loading, error, setView } = useStore();

	const handleSubmit = async () => {
		try {
			if (isLogin) {
				await login(formData.emailOrUsername, formData.password);
				setView("suites");
			} else {
				if (formData.password !== formData.confirmPassword) {
					alert("Passwords do not match");
					return;
				}
				await register({
					email: formData.email,
					username: formData.username,
					password: formData.password,
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
				});
				setView("suites");
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-g p-4 font-young">
			<img className="absolute h-screen w-screen object-cover" src={BGImage} />
			<div className="absolute h-screen w-screen bg-g/60"></div>
			<AnimatedDiv className="rounded-2xl w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold text-amber-400 mb-2 font-athena tracking-widest">
						SIGNATURÉ
					</h1>
					<p className="text-b">Hotel & Resort</p>
				</div>

				<h2 className="text-3xl font-semibold text-c mb-6 text-center">
					{isLogin ? "Sign In" : "Register"}
				</h2>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<div className="space-y-4">
					{isLogin ? (
						<>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="text"
									name="emailOrUsername"
									placeholder="Email / Username"
									value={formData.emailOrUsername}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>

							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="password"
									name="password"
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>
						</>
					) : (
						<>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="text"
									name="firstName"
									placeholder="First Name"
									value={formData.firstName}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
								<input
									type="text"
									name="lastName"
									placeholder="Last Name"
									value={formData.lastName}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>

							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="email"
									name="email"
									placeholder="Email"
									value={formData.email}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>

							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="text"
									name="username"
									placeholder="Username"
									value={formData.username}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>

							<div className="relative">
								<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="tel"
									name="phone"
									placeholder="Phone Number"
									value={formData.phone}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-mono"
								/>
							</div>

							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="password"
									name="password"
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>

							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-d w-5 h-5" />
								<input
									type="password"
									name="confirmPassword"
									placeholder="Confirm Password"
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 bg-a rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
								/>
							</div>
						</>
					)}

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="w-full bg-gradient-to-r bg-d text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all disabled:opacity-50"
					>
						{loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
					</button>
				</div>

				<div className="mt-6 text-center">
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-amber-400 hover:text-amber-500 underline transition-colors"
					>
						{isLogin ? "Register Instead" : "Already have an account? Sign In"}
					</button>
				</div>
			</AnimatedDiv>
		</div>
	);
};

export default Login;
