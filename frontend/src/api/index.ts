// src/api/index.ts

// API URL (defaults to localhost if not provided in environment)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

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
};
