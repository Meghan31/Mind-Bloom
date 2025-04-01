// import {Environment} from "./environment";
// import {Express} from "express";
// import {databaseTemplate} from "./databaseSupport/databaseTemplate";
// import {staticFileHandler} from "./webSupport/staticFileHandler";
// import {index} from "./handleIndex";
// import {health} from "./handleHealth";

// export const configureApp = (environment: Environment) => (app: Express) => {
//     const dbTemplate = databaseTemplate.create(environment.databaseUrl);

//     index.registerHandler(app);
//     health.registerHandler(app, dbTemplate);
//     staticFileHandler.registerHandler(app);
// };

// src/appConfig.ts
import cors from 'cors';
import express, { Express } from 'express';
import { databaseTemplate } from './databaseSupport/databaseTemplate';
import { Environment } from './environment';
import { health } from './handleHealth';
import { index } from './handleIndex';
import { registerAuthRoutes } from './routes/authRoutes';
import { staticFileHandler } from './webSupport/staticFileHandler';

export const configureApp = (environment: Environment) => (app: Express) => {
	const dbTemplate = databaseTemplate.create(environment.databaseUrl);

	// Middleware
	app.use(cors()); // Enable CORS for the frontend to communicate with backend
	app.use(express.json()); // Parse JSON bodies

	// Basic routes
	index.registerHandler(app);
	health.registerHandler(app, dbTemplate);

	// API Routes
	registerAuthRoutes(app, dbTemplate);

	// Serve static files
	staticFileHandler.registerHandler(app);
};
