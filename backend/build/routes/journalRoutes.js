"use strict";
// // src/routes/journalRoutes.ts
// import { Express } from 'express';
// import jwt from 'jsonwebtoken';
// import { DatabaseTemplate } from '../databaseSupport/databaseTemplate';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJournalRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};
const registerJournalRoutes = (app, dbTemplate) => {
    console.log('Registering journal routes'); // Debug log
    // Create a new journal entry
    app.post('/api/journal', authenticateToken, async (req, res) => {
        console.log('POST /api/journal received:', req.body); // Debug log
        try {
            const { content, mood } = req.body;
            const userId = req.user.userId;
            // Validate request
            if (!content || !mood) {
                return res.status(400).json({ error: 'Content and mood are required' });
            }
            // Get a random affirmation based on mood
            const affirmations = await dbTemplate.query('SELECT * FROM affirmations WHERE mood_type = $1 ORDER BY RANDOM() LIMIT 1', (row) => row, mood);
            const affirmation = affirmations.length > 0 ? affirmations[0] : null;
            const affirmationId = affirmation ? affirmation.id : null;
            // Insert journal entry
            await dbTemplate.execute('INSERT INTO journal_entries (user_id, content, mood, affirmation_id, entry_date) VALUES ($1, $2, $3, $4, CURRENT_DATE)', userId, content, mood, affirmationId);
            // Get the newly created entry
            const entries = await dbTemplate.query('SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', (row) => row, userId);
            // Return the entry with the affirmation
            res.status(201).json({
                message: 'Journal entry created successfully',
                entry: entries[0],
                affirmation: affirmation ? affirmation.content : null,
            });
        }
        catch (error) {
            console.error('Journal entry creation error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get all journal entries for the logged-in user
    app.get('/api/journal', authenticateToken, async (req, res) => {
        console.log('GET /api/journal received'); // Debug log
        try {
            const userId = req.user.userId;
            // Get all entries for the user with affirmations
            const entries = await dbTemplate.query(`SELECT j.*, a.content as affirmation_content, a.mood_type 
         FROM journal_entries j 
         LEFT JOIN affirmations a ON j.affirmation_id = a.id 
         WHERE j.user_id = $1 
         ORDER BY j.entry_date DESC`, (row) => row, userId);
            console.log(`Retrieved ${entries.length} entries for user ${userId}`); // Debug log
            res.status(200).json(entries);
        }
        catch (error) {
            console.error('Journal entries fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get a specific journal entry by ID
    app.get('/api/journal/:id', authenticateToken, async (req, res) => {
        console.log(`GET /api/journal/${req.params.id} received`); // Debug log
        try {
            const userId = req.user.userId;
            const entryId = req.params.id;
            // Get the entry with affirmation
            const entries = await dbTemplate.query(`SELECT j.*, a.content as affirmation_content, a.mood_type 
         FROM journal_entries j 
         LEFT JOIN affirmations a ON j.affirmation_id = a.id 
         WHERE j.id = $1 AND j.user_id = $2`, (row) => row, entryId, userId);
            if (entries.length === 0) {
                return res.status(404).json({ error: 'Journal entry not found' });
            }
            res.status(200).json(entries[0]);
        }
        catch (error) {
            console.error('Journal entry fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Get entries by date
    app.get('/api/journal/date/:date', authenticateToken, async (req, res) => {
        console.log(`GET /api/journal/date/${req.params.date} received`); // Debug log
        try {
            const userId = req.user.userId;
            const entryDate = req.params.date; // Format: YYYY-MM-DD
            // Get entries for the specified date
            const entries = await dbTemplate.query(`SELECT j.*, a.content as affirmation_content, a.mood_type 
         FROM journal_entries j 
         LEFT JOIN affirmations a ON j.affirmation_id = a.id 
         WHERE j.user_id = $1 AND j.entry_date = $2
         ORDER BY j.created_at DESC`, (row) => row, userId, entryDate);
            console.log(`Retrieved ${entries.length} entries for date ${entryDate}`); // Debug log
            res.status(200).json(entries);
        }
        catch (error) {
            console.error('Journal entries by date fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.registerJournalRoutes = registerJournalRoutes;
