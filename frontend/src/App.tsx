import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/authentication/Login';
import Registration from './pages/authentication/Registration';
import Home from './pages/home/Home';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/home" element={<Home />} />
					<Route path="/auth/login" element={<Login />} />
					<Route path="/auth/register" element={<Registration />} />

					<Route path="*" element={<Home />} />
				</Routes>
			</Router>

			{/* <PopupNotification /> */}
		</>
	);
}

export default App;
