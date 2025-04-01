// // frontend/src/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useReducer } from 'react';
// import { authAPI } from '../api';
// import { AuthState, User } from '../types';

// // Define the context type
// interface AuthContextType {
// 	state: AuthState;
// 	register: (
// 		username: string,
// 		email: string,
// 		password: string
// 	) => Promise<void>;
// 	login: (username: string, password: string) => Promise<void>;
// 	logout: () => void;
// }

// // Initial state
// const initialState: AuthState = {
// 	isAuthenticated: false,
// 	user: null,
// 	token: localStorage.getItem('token'),
// 	loading: true,
// 	error: null,
// };

// // Create the context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Action types
// type AuthAction =
// 	| { type: 'REGISTER_SUCCESS'; payload: { message: string } }
// 	| { type: 'REGISTER_FAIL'; payload: string }
// 	| { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
// 	| { type: 'LOGIN_FAIL'; payload: string }
// 	| { type: 'LOGOUT' }
// 	| { type: 'USER_LOADED'; payload: User }
// 	| { type: 'AUTH_ERROR' }
// 	| { type: 'CLEAR_ERROR' };

// // Reducer function
// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
// 	switch (action.type) {
// 		case 'REGISTER_SUCCESS':
// 			return {
// 				...state,
// 				loading: false,
// 				error: null,
// 			};
// 		case 'REGISTER_FAIL':
// 			return {
// 				...state,
// 				loading: false,
// 				error: action.payload,
// 			};
// 		case 'LOGIN_SUCCESS':
// 			localStorage.setItem('token', action.payload.token);
// 			return {
// 				...state,
// 				isAuthenticated: true,
// 				user: action.payload.user,
// 				token: action.payload.token,
// 				loading: false,
// 				error: null,
// 			};
// 		case 'LOGIN_FAIL':
// 		case 'AUTH_ERROR':
// 			localStorage.removeItem('token');
// 			return {
// 				...state,
// 				isAuthenticated: false,
// 				user: null,
// 				token: null,
// 				loading: false,
// 				// error: action.payload
// 			};
// 		case 'LOGOUT':
// 			localStorage.removeItem('token');
// 			return {
// 				...state,
// 				isAuthenticated: false,
// 				user: null,
// 				token: null,
// 				loading: false,
// 				error: null,
// 			};
// 		case 'USER_LOADED':
// 			return {
// 				...state,
// 				isAuthenticated: true,
// 				user: action.payload,
// 				loading: false,
// 				error: null,
// 			};
// 		case 'CLEAR_ERROR':
// 			return {
// 				...state,
// 				error: null,
// 			};
// 		default:
// 			return state;
// 	}
// };

// // Auth Provider Component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	const [state, dispatch] = useReducer(authReducer, initialState);

// 	// Load user on initial render if token exists
// 	useEffect(() => {
// 		const loadUser = async () => {
// 			if (localStorage.getItem('token')) {
// 				try {
// 					const user = await authAPI.getCurrentUser();
// 					dispatch({ type: 'USER_LOADED', payload: user });
// 				} catch {
// 					dispatch({ type: 'AUTH_ERROR' });
// 				}
// 			} else {
// 				dispatch({ type: 'AUTH_ERROR' });
// 			}
// 		};

// 		loadUser();
// 	}, []);

// 	// Register user
// 	const register = async (
// 		username: string,
// 		email: string,
// 		password: string
// 	) => {
// 		try {
// 			const result = await authAPI.register(username, email, password);
// 			dispatch({ type: 'REGISTER_SUCCESS', payload: result });
// 		} catch (error) {
// 			dispatch({
// 				type: 'REGISTER_FAIL',
// 				payload: error instanceof Error ? error.message : 'Registration failed',
// 			});
// 		}
// 	};

// 	// Login user
// 	const login = async (username: string, password: string) => {
// 		try {
// 			const result = await authAPI.login(username, password);
// 			dispatch({ type: 'LOGIN_SUCCESS', payload: result });
// 		} catch (error) {
// 			dispatch({
// 				type: 'LOGIN_FAIL',
// 				payload: error instanceof Error ? error.message : 'Login failed',
// 			});
// 		}
// 	};

// 	// Logout user
// 	const logout = () => {
// 		authAPI.logout();
// 		dispatch({ type: 'LOGOUT' });
// 	};

// 	return (
// 		<AuthContext.Provider value={{ state, register, login, logout }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };

// // Custom hook to use auth context
// export const useAuth = (): AuthContextType => {
// 	const context = useContext(AuthContext);
// 	if (context === undefined) {
// 		throw new Error('useAuth must be used within an AuthProvider');
// 	}
// 	return context;
// };
