"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireJwtMiddleware = requireJwtMiddleware;
const jwt_1 = require("../configs/jwt");
const config_1 = __importDefault(require("../configs/config"));
/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
function requireJwtMiddleware(request, response, next) {
    const unauthorized = (message) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });
    const requestHeader = "Authorization";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = request.header(requestHeader);
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }
    // Extract token from the header by removing "Bearer " prefix
    let token = header;
    // Check if the header starts with "Bearer " and extract only the token part
    if (header.startsWith("Bearer ")) {
        token = header.slice(7); // Remove "Bearer " prefix (7 characters)
    }
    const decodedSession = (0, jwt_1.decodeSession)(config_1.default.jwt.access_token, token);
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }
    const expiration = (0, jwt_1.checkExpirationStatus)(decodedSession.session);
    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }
    let session;
    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = (0, jwt_1.encodeSession)(config_1.default.jwt.access_token, decodedSession.session);
        session = Object.assign(Object.assign({}, decodedSession.session), { expires: expires, issued: issued });
        response.setHeader(responseHeader, token);
    }
    else {
        session = decodedSession.session;
    }
    // Set the session on response.locals object for routes to access
    response.locals = Object.assign(Object.assign({}, response.locals), { session: session });
    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}
