// src/api/index.ts

// API URL (defaults to localhost if not provided in environment)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Log the API URL on startup
console.log('Using API URL:', API_URL);

// Helper function to get the auth token
const getAuthHeader = () => {
	const token = localStorage.getItem('token');
	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	};
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
	// Log response details for debugging
	console.log(`API Response: ${response.url} - Status: ${response.status}`);

	if (!response.ok) {
		let errorMessage = `API Error: ${response.status} ${response.statusText}`;

		try {
			// Try to parse error as JSON
			const errorData = await response.json();
			errorMessage = errorData.error || errorMessage;
		} catch (e) {
			// If not JSON, try to get error as text
			try {
				const errorText = await response.text();
				if (errorText) {
					errorMessage = errorText;
				}
			} catch (textError) {
				// If we can't get text either, use the default error message
			}
		}

		console.error(errorMessage);
		throw new Error(errorMessage);
	}

	return response.json();
};

// Auth API endpoints
export const authAPI = {
	// Register a new user
	register: async (
		username: string,
		email: string,
		password: string
	): Promise<{ message: string }> => {
		console.log('Registering user:', { username, email });

		const response = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password }),
		});

		return handleResponse(response);
	},

	// Login an existing user
	login: async (
		email: string,
		password: string
	): Promise<{ message: string; token: string; user: any }> => {
		console.log('Logging in user:', { email });

		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await handleResponse(response);

		// Store the token in local storage for future requests
		localStorage.setItem('token', data.token);
		console.log('User logged in successfully, token saved');

		return data;
	},

	// Logout the current user
	logout: () => {
		localStorage.removeItem('token');
		console.log('User logged out, token removed');
	},
};

// Journal API endpoints
export const journalAPI = {
	// Create a new journal entry
	createEntry: async (content: string, mood: string): Promise<any> => {
		console.log('Creating journal entry:', {
			content: content.substring(0, 20) + '...',
			mood,
		});

		const response = await fetch(`${API_URL}/journal`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify({ content, mood }),
		});

		return handleResponse(response);
	},

	// Get all journal entries
	getAllEntries: async (): Promise<any[]> => {
		console.log('Fetching all journal entries');

		const response = await fetch(`${API_URL}/journal`, {
			method: 'GET',
			headers: getAuthHeader(),
		});

		return handleResponse(response);
	},

	// Get a specific journal entry
	getEntry: async (id: number): Promise<any> => {
		console.log('Fetching journal entry:', id);

		const response = await fetch(`${API_URL}/journal/${id}`, {
			method: 'GET',
			headers: getAuthHeader(),
		});

		return handleResponse(response);
	},

	// Get entries by date
	getEntriesByDate: async (date: string): Promise<any[]> => {
		console.log('Fetching journal entries for date:', date);

		const response = await fetch(`${API_URL}/journal/date/${date}`, {
			method: 'GET',
			headers: getAuthHeader(),
		});

		return handleResponse(response);
	},
};

// Affirmation API endpoints
export const affirmationAPI = {
	// Get today's affirmation based on mood
	getTodayAffirmation: async (mood: string): Promise<any> => {
		console.log("Fetching today's affirmation for mood:", mood);

		const response = await fetch(`${API_URL}/affirmation/today?mood=${mood}`, {
			method: 'GET',
			headers: getAuthHeader(),
		});

		return handleResponse(response);
	},

	// Get all affirmations for a specific mood
	getMoodAffirmations: async (mood: string): Promise<any[]> => {
		console.log('Fetching all affirmations for mood:', mood);

		const response = await fetch(`${API_URL}/affirmations/${mood}`, {
			method: 'GET',
			headers: getAuthHeader(),
		});

		return handleResponse(response);
	},
};

// Simple test endpoint to check if API is reachable
export const testAPI = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${API_URL}/test`);
		await handleResponse(response);
		console.log('API connection test successful');
		return true;
	} catch (error) {
		console.error('API connection test failed:', error);
		return false;
	}
};

// Run an API test on module import
testAPI().then((isConnected) => {
	if (!isConnected) {
		console.warn('WARNING: Unable to connect to API at', API_URL);
	}
});
