"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
// src/appConfig.ts
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const databaseTemplate_1 = require("./databaseSupport/databaseTemplate");
const handleHealth_1 = require("./handleHealth");
const handleIndex_1 = require("./handleIndex");
const affirmationRoutes_1 = require("./routes/affirmationRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const journalRoutes_1 = require("./routes/journalRoutes");
const testRoutes_1 = require("./routes/testRoutes");
const staticFileHandler_1 = require("./webSupport/staticFileHandler");
const configureApp = (environment) => (app) => {
    const dbTemplate = databaseTemplate_1.databaseTemplate.create(environment.databaseUrl);
    // Middleware
    app.use((0, cors_1.default)()); // Enable CORS for the frontend to communicate with backend
    app.use(express_1.default.json()); // Parse JSON bodies
    // Basic routes
    handleIndex_1.index.registerHandler(app);
    handleHealth_1.health.registerHandler(app, dbTemplate);
    // API Routes
    (0, authRoutes_1.registerAuthRoutes)(app, dbTemplate);
    (0, journalRoutes_1.registerJournalRoutes)(app, dbTemplate);
    (0, affirmationRoutes_1.registerAffirmationRoutes)(app, dbTemplate);
    (0, testRoutes_1.registerTestRoutes)(app); // Add test routes
    // Serve static files
    staticFileHandler_1.staticFileHandler.registerHandler(app);
};
exports.configureApp = configureApp;
