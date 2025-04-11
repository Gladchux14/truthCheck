"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const package_json_1 = require("../../package.json");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Note-Taking API Documentation',
            version: package_json_1.version,
            description: 'API documentation for the Note-Taking application',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: '',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '5f8d04b3ab35b428f8611098'
                        },
                        username: {
                            type: 'string',
                            example: 'john doe'
                        },
                        email: {
                            type: 'string',
                            example: 'johndoe@gmail.com'
                        },
                        password: {
                            type: 'string',
                            example: 'Password123!'
                        }
                    }
                },
            }
        }
    },
    apis: ['./src/routes/*.ts'] // Path to the API routes files
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
