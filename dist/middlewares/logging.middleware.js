"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    var _a;
    const loggingData = {
        method: req.method,
        path: req.path,
        timestamp: new Date(),
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id // If you have authentication implemented
    };
    // Log the request data
    console.log(`[${loggingData.timestamp.toISOString()}] ${loggingData.method} ${loggingData.path}`);
    console.log('Request data:', JSON.stringify(loggingData, null, 2));
    // Capture response time
    const startTime = Date.now();
    // Listen for the response finish event
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
