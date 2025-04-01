"use strict";
// import {Environment} from "./environment";
// import {Express} from "express";
// import {databaseTemplate} from "./databaseSupport/databaseTemplate";
// import {staticFileHandler} from "./webSupport/staticFileHandler";
// import {index} from "./handleIndex";
// import {health} from "./handleHealth";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
// export const configureApp = (environment: Environment) => (app: Express) => {
//     const dbTemplate = databaseTemplate.create(environment.databaseUrl);
//     index.registerHandler(app);
//     health.registerHandler(app, dbTemplate);
//     staticFileHandler.registerHandler(app);
// };
// src/appConfig.ts
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const databaseTemplate_1 = require("./databaseSupport/databaseTemplate");
const handleHealth_1 = require("./handleHealth");
const handleIndex_1 = require("./handleIndex");
const authRoutes_1 = require("./routes/authRoutes");
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
    // Serve static files
    staticFileHandler_1.staticFileHandler.registerHandler(app);
};
exports.configureApp = configureApp;
