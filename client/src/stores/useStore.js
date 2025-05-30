import { create } from "zustand";

const API_URL = "http://localhost:5000/api";

const useStore = create((set, get) => ({
	// Auth State
	user: null,
	token: null,
	isAuthenticated: false,

	// UI State
	loading: false,
	error: null,
	currentView: "home",
	sidebarOpen: false,

	// Suites State
	suites: [],
	selectedSuite: null,

	// Bookings State
	bookings: [],
	currentBookings: [],
	pastBookings: [],

	// Admin State
	adminStats: null,

	// Actions
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	setView: (view) => set({ currentView: view }),
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

	// Auth Actions
	login: async (emailOrUsername, password) => {
		try {
			set({ loading: true, error: null });
			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ emailOrUsername, password }),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
			return data;
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	register: async (userData) => {
		try {
			set({ loading: true, error: null });
			const response = await fetch(`${API_URL}/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Registration failed");

			set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
			return data;
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	logout: () => {
		set({ user: null, token: null, isAuthenticated: false, currentView: "home" });
	},

	fetchProfile: async () => {
		try {
			const token = get().token;
			const response = await fetch(`${API_URL}/auth/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			set({ user: data.user });
			return data.user;
		} catch (error) {
			if (error.message === "Not authorized") {
				get().logout();
			}
			throw error;
		}
	},

	// Suite Actions
	fetchSuites: async () => {
		try {
			set({ loading: true });
			const response = await fetch(`${API_URL}/suites`);
			const data = await response.json();

			if (!response.ok) throw new Error(data.error);
			set({ suites: data.suites, loading: false });
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	checkAvailability: async (suiteId, checkInDate, checkOutDate) => {
		const response = await fetch(
			`${API_URL}/suites/availability?suiteId=${suiteId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
		);
		const data = await response.json();

		if (!response.ok) throw new Error(data.error);
		return data;
	},

	// Booking Actions
	createBooking: async (bookingData) => {
		try {
			set({ loading: true, error: null });
			const token = get().token;

			const response = await fetch(`${API_URL}/bookings`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(bookingData),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			set({ loading: false });
			return data.booking;
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	fetchUserBookings: async (status = null) => {
		const token = get().token;
		const url = status ? `${API_URL}/bookings?status=${status}` : `${API_URL}/bookings`;

		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.error);

		if (status === "current") {
			set({ currentBookings: data.bookings });
		} else if (status === "past") {
			set({ pastBookings: data.bookings });
		} else {
			set({ bookings: data.bookings });
		}

		return data.bookings;
	},

	cancelBooking: async (bookingId) => {
		const token = get().token;
		const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
			method: "PUT",
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.error);

		return data;
	},

	// Admin Actions
	fetchAdminDashboard: async () => {
		const token = get().token;
		const response = await fetch(`${API_URL}/admin/dashboard`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await response.json();
		if (!response.ok) throw new Error(data.error);

		set({ adminStats: data.dashboard });
		return data.dashboard;
	},
}));

export default useStore;
