// src/api/index.ts

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
const API_URL = import.meta.env.VITE_API_URL;

// Auth API endpoints
export const authAPI = {
	// Register a new user
	register: async (
		username: string,
		email: string,
		password: string
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || 'Registration failed');
		}

		return response.json();
	},

	// Login an existing user
	login: async (
		email: string,
		password: string
	): Promise<{
		message: string;
		token: string;
		user: { id: string; name: string; email: string };
	}> => {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || 'Login failed');
		}

		const data = await response.json();

		// Store the token in local storage for future requests
		localStorage.setItem('token', data.token);

		return data;
	},

	// Logout the current user
	logout: () => {
		localStorage.removeItem('token');
	},
};
