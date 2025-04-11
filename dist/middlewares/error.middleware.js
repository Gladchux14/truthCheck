"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_class_1 = require("../utils/error.class");
const errorHandler = (err, req, res, next) => {
    if (err instanceof error_class_1.AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // For unexpected errors
    console.error('ERROR: ', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
