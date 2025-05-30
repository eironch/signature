import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, Home, CalendarDays, User, Star } from "lucide-react";

import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import SuiteList from "./pages/SuiteList";
import HomePage from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import useStore from "./stores/useStore";

const AppContent = () => {
	const { isAuthenticated, user, logout, sidebarOpen, toggleSidebar } = useStore();
	const location = useLocation();
	const navigate = useNavigate();

	// Add blob animation styles
	React.useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      
      .animate-blob {
        animation: blob 7s infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `;
		document.head.appendChild(style);
		return () => document.head.removeChild(style);
	}, []);

	// Helper function to check if current path matches
	const isActivePath = (path) => location.pathname === path;

	// Handle logout
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{isAuthenticated && (
				<>
					<header className="bg-white shadow-md sticky top-0 z-40">
						<div className="container mx-auto px-4 py-4 flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<button
									onClick={toggleSidebar}
									className="md:hidden text-gray-600 hover:text-gray-800"
								>
									<Menu className="w-6 h-6" />
								</button>
								<Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
									SIGNATURE
								</Link>
							</div>

							<nav className="hidden md:flex items-center space-x-6">
								<Link
									to="/"
									className={`text-gray-600 hover:text-orange-600 transition-colors ${
										isActivePath("/") ? "text-orange-600 font-semibold" : ""
									}`}
								>
									Home
								</Link>
								<Link
									to="/suites"
									className={`text-gray-600 hover:text-orange-600 transition-colors ${
										isActivePath("/suites") ? "text-orange-600 font-semibold" : ""
									}`}
								>
									Suites
								</Link>
								<Link
									to="/profile"
									className={`text-gray-600 hover:text-orange-600 transition-colors ${
										isActivePath("/profile") ? "text-orange-600 font-semibold" : ""
									}`}
								>
									Profile
								</Link>
								{user?.role === "admin" && (
									<Link
										to="/admin"
										className={`text-gray-600 hover:text-orange-600 transition-colors ${
											isActivePath("/admin") ? "text-orange-600 font-semibold" : ""
										}`}
									>
										Admin
									</Link>
								)}
								<button
									onClick={handleLogout}
									className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
								>
									<LogOut className="w-4 h-4" />
									<span>Logout</span>
								</button>
							</nav>

							<div className="flex items-center space-x-3">
								<span className="text-gray-600">{user?.firstName || user?.username}</span>
								<div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
									{user?.firstName?.[0] || user?.username?.[0]}
								</div>
							</div>
						</div>
					</header>

					<div
						className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
							sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
						}`}
						onClick={toggleSidebar}
					>
						<div
							className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
								sidebarOpen ? "translate-x-0" : "-translate-x-full"
							}`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">SIGNATURE</h2>
								<nav className="space-y-4">
									<Link
										to="/"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-gray-600 hover:text-orange-600 transition-colors w-full"
									>
										<Home className="w-5 h-5" />
										<span>Home</span>
									</Link>
									<Link
										to="/suites"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-gray-600 hover:text-orange-600 transition-colors w-full"
									>
										<CalendarDays className="w-5 h-5" />
										<span>Suites</span>
									</Link>
									<Link
										to="/profile"
										onClick={toggleSidebar}
										className="flex items-center space-x-3 text-gray-600 hover:text-orange-600 transition-colors w-full"
									>
										<User className="w-5 h-5" />
										<span>Profile</span>
									</Link>
									{user?.role === "admin" && (
										<Link
											to="/admin"
											onClick={toggleSidebar}
											className="flex items-center space-x-3 text-gray-600 hover:text-orange-600 transition-colors w-full"
										>
											<Star className="w-5 h-5" />
											<span>Admin</span>
										</Link>
									)}
									<button
										onClick={() => {
											handleLogout();
											toggleSidebar();
										}}
										className="flex items-center space-x-3 text-red-500 hover:text-red-600 transition-colors w-full pt-4 border-t"
									>
										<LogOut className="w-5 h-5" />
										<span>Logout</span>
									</button>
								</nav>
							</div>
						</div>
					</div>
				</>
			)}

			<main className={isAuthenticated && location.pathname !== "/" ? "container mx-auto" : ""}>
				<Routes>
					<Route path="/login" element={<Login />} />
					
					{isAuthenticated ? (
						<>
							<Route path="/" element={<HomePage />} />
							<Route path="/suites" element={<SuiteList />} />
							<Route path="/profile" element={<UserProfile />} />
							{user?.role === "admin" && (
								<Route path="/admin" element={<AdminDashboard />} />
							)}
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
