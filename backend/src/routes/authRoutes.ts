// src/routes/authRoutes.ts
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { DatabaseTemplate } from '../databaseSupport/databaseTemplate';

export const registerAuthRoutes = (
	app: Express,
	dbTemplate: DatabaseTemplate
) => {
	// Register a new user
	app.post('/api/auth/register', async (req, res) => {
		try {
			const { username, email, password } = req.body;

			// Basic validation
			if (!username || !email || !password) {
				return res.status(400).json({ error: 'All fields are required' });
			}

			// Check if email already exists
			const existingEmails = await dbTemplate.query(
				'SELECT * FROM users WHERE email = $1',
				(row) => row,
				email
			);

			if (existingEmails.length > 0) {
				return res.status(400).json({ error: 'Email already registered' });
			}

			// Hash the password
			const saltRounds = 10;
			const passwordHash = await bcrypt.hash(password, saltRounds);

			// Insert new user
			await dbTemplate.execute(
				'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
				username,
				email,
				passwordHash
			);

			res.status(201).json({ message: 'User registered successfully' });
		} catch (error) {
			console.error('Registration error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	});
};
