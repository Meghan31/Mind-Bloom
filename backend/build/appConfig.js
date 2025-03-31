"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = void 0;
const databaseTemplate_1 = require("./databaseSupport/databaseTemplate");
const staticFileHandler_1 = require("./webSupport/staticFileHandler");
const handleIndex_1 = require("./handleIndex");
const handleHealth_1 = require("./handleHealth");
const configureApp = (environment) => (app) => {
    const dbTemplate = databaseTemplate_1.databaseTemplate.create(environment.databaseUrl);
    handleIndex_1.index.registerHandler(app);
    handleHealth_1.health.registerHandler(app, dbTemplate);
    staticFileHandler_1.staticFileHandler.registerHandler(app);
};
exports.configureApp = configureApp;
