import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Menu, Home, CalendarDays, User, Star } from "lucide-react";

import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import SuiteList from "./pages/SuiteList";
import HomePage from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import useStore from "./stores/useStore";

const AppContent = () => {
	const { isAuthenticated, user, sidebarOpen, toggleSidebar } = useStore();
	const location = useLocation();

	// Helper function to check if current path matches
	const isActivePath = (path) => location.pathname === path;

	return (
		<div className="bg-g">
			{isAuthenticated && (
				<>
					<header className="sticky top-0 z-40 font-young">
						<div className="container mx-auto px-4 py-4 flex items-center justify-between">
							<div className="flex-1 items-center space-x-4 flex ">
								<button
									onClick={toggleSidebar}
									className="md:hidden text-amber-400 hover:text-amber-500"
								>
									<Menu className="w-6 h-6" />
								</button>
								<Link to="/" className="sm:text-2xl text-base font-bold text-amber-400 hover:text-amber-500">
									SIGNATURÉ
								</Link>
							</div>

							<nav className="flex-1 hidden md:flex items-center justify-center space-x-6 text-xl">
								<Link
									to="/"
									className={` hover:text-amber-400 transition-colors ${
										isActivePath("/") ? "text-amber-400 font-semibold" : "text-a"
									}`}
								>
									Home
								</Link>
								<Link
									to="/suites"
									className={`hover:text-amber-400 transition-colors ${
										isActivePath("/suites") ? "text-amber-400 font-semibold" : "text-a"
									}`}
								>
									Suites
								</Link>
								<Link
									to="/profile"
									className={`hover:text-amber-400 transition-colors ${
										isActivePath("/profile") ? "text-amber-400 font-semibold" : "text-a"
									}`}
								>
									Profile
								</Link>
								{user?.role === "admin" && (
									<Link
										to="/admin"
										className={`hover:text-amber-400 transition-colors ${
											isActivePath("/admin") ? "text-amber-400 font-semibold" : "text-a"
										}`}
									>
										Admin
									</Link>
								)}
							</nav>

							<Link to="/profile" className="flex-1 flex justify-end items-center space-x-3">
								<div className="sm:text-2xl text-base font-bold text-amber-400 hover:text-amber-500">
									Welcome, {user?.firstName || user?.username}
								</div>
								<div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-g font-semibold">
									{user?.firstName?.[0] || user?.username?.[0]}
								</div>
							</Link>
						</div>
					</header>

					<div
						className={`fixed inset-0 bg-opacity-50 z-50 md:hidden transition-opacity duration-300 font-young text-amber-400 ${
							sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
						}`}
						onClick={toggleSidebar}
					>
						<div
							className={`fixed left-0 top-0 h-full w-64 bg-f shadow-xl transform transition-transform duration-300 ${
								sidebarOpen ? "translate-x-0" : "-translate-x-full"
							}`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6">
								<h2 className="text-2xl font-bold mb-6">SIGNATURE</h2>
								<nav className="space-y-4">
									<Link
										to="/"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-amber-400 hover:text-amber-500 transition-colors w-full"
									>
										<Home className="w-5 h-5" />
										<span>Home</span>
									</Link>
									<Link
										to="/suites"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-amber-400 hover:text-amber-500 transition-colors w-full"
									>
										<CalendarDays className="w-5 h-5" />
										<span>Suites</span>
									</Link>
									<Link
										to="/profile"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-amber-400 hover:text-amber-500 transition-colors w-full"
									>
										<User className="w-5 h-5" />
										<span>Profile</span>
									</Link>
									{user?.role === "admin" && (
										<Link
											to="/admin"
											onClick={toggleSidebar}
											className="flex items-center space-x-3 text-amber-400 hover:text-amber-500 transition-colors w-full"
										>
											<Star className="w-5 h-5" />
											<span>Admin</span>
										</Link>
									)}
								</nav>
							</div>
						</div>
					</div>
				</>
			)}

			<main className={isAuthenticated && location.pathname !== "/" ? "mx-auto" : ""}>
				<Routes>
					{isAuthenticated ? (
						<>
							<Route path="/" element={<HomePage />} />
							<Route path="/suites" element={<SuiteList />} />
							<Route path="/profile" element={<UserProfile />} />
							{user?.role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}
							<Route path="*" element={<HomePage />} />
						</>
					) : (
						<>
							<Route path="*" element={<Login />} />
						</>
					)}
				</Routes>
			</main>
		</div>
	);
};

const App = () => {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
};

export default App;
