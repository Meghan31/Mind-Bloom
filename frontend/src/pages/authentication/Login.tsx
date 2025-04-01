import { Button } from '@/components/ui/button';
import { useState } from 'react';
import './auth.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [error, setError] = useState<string | null>(null);
	// const [loading, setLoading] = useState(false);
	// const [success, setSuccess] = useState(false);

	const handldeLogin = (): void => {
		// Add form submission logic here
		console.log('Login clicked');
		console.log('email:', email);
	};
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 h-1.5">
			<h1 className="text-2xl font-bold">Login</h1>

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
						// placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						// placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<br />
				<div className="flex items-center gap-7 justify-center mt-2">
					<div
						onClick={() => {
							window.location.href = '/auth/register';
						}}
					>
						<Button variant="outline" className="ml-2">
							Register
						</Button>
					</div>
					<div
						onClick={() => {
							handldeLogin();
						}}
					>
						<Button>Login</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
