"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../.env')
});
const envSchema = joi_1.default.object().keys({
    //   NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.number().required().default('4000'),
    ACCESS_TOKEN_SECRET: joi_1.default.string().min(8).required(),
    API_V1_STR: joi_1.default.string().required(),
    MONGO_URI: joi_1.default.string().required(),
    //   ACCESS_TOKEN_EXPIRE: Joi.string().required().default('20m'),
    //   REFRESH_TOKEN_SECRET: Joi.string().min(8).required(),
    //   REFRESH_TOKEN_EXPIRE: Joi.string().required().default('1d'),
    //   REFRESH_TOKEN_COOKIE_NAME: Joi.string().required().default('jid'),
});
const { value: validatedEnv, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env, { abortEarly: false, stripUnknown: true });
if (error) {
    throw new Error(`Environment variable validation error: \n${error.details
        .map((detail) => detail.message)
        .join('\n')}`);
}
const config = {
    node_env: validatedEnv.NODE_ENV,
    server: {
        port: validatedEnv.PORT,
    },
    jwt: {
        access_token: validatedEnv.ACCESS_TOKEN_SECRET,
        refresh_token: {
            secret: validatedEnv.REFRESH_TOKEN_SECRET,
            expire: validatedEnv.REFRESH_TOKEN_EXPIRE,
            cookie_name: validatedEnv.REFRESH_TOKEN_COOKIE_NAME
        }
    },
    api: validatedEnv.API_V1_STR,
    dbUrl: validatedEnv.MONGO_URI,
};
exports.default = config;
