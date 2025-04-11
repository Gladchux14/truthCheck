"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./configs/database");
const config_1 = __importDefault(require("./configs/config"));
const PORT = config_1.default.server.port || 5000;
// Connect to database
(0, database_1.connectDB)().then(() => {
    // Start server
    app_1.default.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
    });
});
