// src/pages/calendar/CalendarPage.tsx
import { Button } from '@/components/ui/button';
import JournalCalendar from '@/sections/JournalCalendar';
import { motion } from 'framer-motion';
import { Home, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';
import './calendar.css';

// Define a simple User type
type User = {
	id: number;
	username: string;
	email: string;
};

const CalendarPage = () => {
	const [user, setUser] = useState<User | null>(null);
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

	return (
		<div className={`whole ${darkMode ? 'dark' : ''}`}>
			<div className="nav-bar">
				<motion.h1
					className="text-4xl font-bold text-gradient  "
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					style={{
						textShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
					}}
				>
					Mind-Bloom Journal Calendar
				</motion.h1>
				<div className="flex items-center gap-4">
					<Link to="/home">
						<Button variant="outline" className="flex items-center gap-2">
							<Home size={18} color="black" />
							<span style={{ color: 'black' }}>Return Home</span>
						</Button>
					</Link>
					<Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
						{darkMode ? <Sun size={20} /> : <Moon size={20} />}
					</Button>
				</div>
			</div>
			<div className="calendar-container">
				<div className="user-info mb-4">
					<h2>
						<strong>{user.username}'s</strong> Journal History
					</h2>
				</div>

				<div className="calendar-view">
					<JournalCalendar />
				</div>

				<div className="logout mt-8">
					<Button onClick={handleLogout} variant="destructive">
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;
