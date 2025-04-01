import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authAPI } from '../../api';
import './auth.css';

const Registration = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateForm = () => {
		// Basic validation
		if (!username.trim()) {
			setError('Username is required');
			return false;
		}

		if (!email.trim()) {
			setError('Email is required');
			return false;
		}

		// Simple email validation
		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email');
			return false;
		}

		if (!password.trim()) {
			setError('Password is required');
			return false;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters');
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		// Reset states
		setError(null);
		setSuccess(false);

		// Validate the form
		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			// Call the register API
			await authAPI.register(username, email, password);
			setSuccess(true);
			setLoading(false);

			// Reset the form
			setUsername('');
			setEmail('');
			setPassword('');

			// Redirect to login after 2 seconds
			setTimeout(() => {
				window.location.href = '/auth/login';
			}, 2000);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Registration failed. Please try again.'
			);
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 h-1.5">
			<h1 className="text-2xl font-bold">Registration</h1>

			{error && <div className="text-red-500 mt-4">{error}</div>}

			{success && (
				<div className="text-green-500 mt-4">
					Registration successful! Redirecting to login...
				</div>
			)}

			<div className="flex flex-col justify-between mb-4 m-10 gap-1">
				<div className="flex items-center gap-7 justify-between mt-2">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700"
					>
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						className="form-input"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						disabled={loading}
					/>
				</div>

				<div className="flex items-center gap-7 justify-between mt-2">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="form-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
					/>
				</div>
				<div className="flex items-center gap-7 justify-between mt-2">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="form-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
					/>
				</div>

				<br />
				<div className="flex items-center gap-7 justify-center mt-2">
					<div
						onClick={() => {
							if (!loading) {
								window.location.href = '/auth/login';
							}
						}}
					>
						<Button variant="outline" className="ml-2" disabled={loading}>
							Login
						</Button>
					</div>
					<div
						onClick={() => {
							if (!loading) {
								handleSubmit();
							}
						}}
					>
						<Button disabled={loading}>
							{loading ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Registration;
