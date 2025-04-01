import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authAPI } from '../../api';
import './auth.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateForm = () => {
		// Basic validation
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
			// Call the login API
			await authAPI.login(email, password);
			setSuccess(true);

			// Redirect to home after successful login
			window.location.href = '/home';
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Login failed. Please check your credentials and try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 h-1.5">
			<h1 className="text-2xl font-bold">Login</h1>

			{error && <div className="text-red-500 mt-4">{error}</div>}

			{success && (
				<div className="text-green-500 mt-4">
					Login successful! Redirecting...
				</div>
			)}

			<div className="flex flex-col justify-between mb-4 m-10 gap-1">
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
								window.location.href = '/auth/register';
							}
						}}
					>
						<Button variant="outline" className="ml-2" disabled={loading}>
							Register
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
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
// Note: The above code is a simplified version of the login page. In a real-world application, you would also want to handle token storage, user session management, and possibly use a state management library like Redux or Context API for better state handling across your application.
