"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import userRoutes from './routes/userRoutes';
// import errorHandler from './middleware/errorHandler';
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
// app.use('/api/users', userRoutes);
// Error Handling Middleware
// app.use(errorHandler);
exports.default = app;
