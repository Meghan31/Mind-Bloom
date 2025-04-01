// home.tsx
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../api';
import './home.css';

// Define a simple User type
type User = {
	id: number;
	username: string;
	email: string;
};

const Home = () => {
	const [user, setUser] = useState<User | null>(null);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			window.location.href = '/auth/login';
			return;
		}

		try {
			const parseJwt = (token: string) => {
				const base64Url = token.split('.')[1];
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split('')
						.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
						.join('')
				);
				return JSON.parse(jsonPayload);
			};

			const decoded = parseJwt(token);
			setUser({
				id: decoded.userId,
				username: decoded.username,
				email: decoded.email,
			});
		} catch (error) {
			console.error('Error parsing token:', error);
			handleLogout();
		}
	}, []);

	const handleLogout = () => {
		authAPI.logout();
		window.location.href = '/auth/login';
	};

	if (!user) {
		return <div className="loading">Loading...</div>;
	}

	const goToDate = () => {
		if (date) {
			window.location.href = `/journal/${date.toISOString().split('T')[0]}`;
		}
	};

	return (
		<div className={`whole ${darkMode ? 'dark' : ''}`}>
			<div className="nav-bar">
				<h1>Welcome to Mind-Bloom</h1>
				<Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
					{darkMode ? <Sun size={20} /> : <Moon size={20} />}
				</Button>
			</div>
			<div className="screen">
				<motion.div
					className="left-user"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="user-info">
						<h2>
							Hi, <strong>{user.username}</strong>! How are you today?
						</h2>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
					</div>
					<div
						className="calendar"
						style={{
							display: 'flex',
							flexDirection: 'column',

							justifyContent: 'center',
							gap: '1rem',
							alignItems: 'center',
							height: '100%',
						}}
					>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							className="rounded-md border"
						/>
						<Button onClick={goToDate}>
							{' '}
							Go to{' '}
							{date?.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</Button>
					</div>
					<div className="logout">
						<Button onClick={handleLogout} variant="destructive">
							Logout
						</Button>
					</div>
				</motion.div>
				<motion.div
					className="right-app"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2>Today’s Affirmation 🌿</h2>
					<p className="affirmation">"Quotes to be send here!!"</p>
				</motion.div>
				{/* 
				
				We have to add a section for the journal entries here.
				We can use a card component to display the journal entries.
				
				*/}
			</div>
		</div>
	);
};

export default Home;
