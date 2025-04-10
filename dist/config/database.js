"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// config/db.js
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("Mongo URI is missing");
    }
    console.log("Connecting to DB");
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connect(mongoUri, {}).then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
        console.log("Error connecting to DB");
    });
};
exports.connectDB = connectDB;
