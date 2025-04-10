"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSession = encodeSession;
exports.decodeSession = decodeSession;
exports.checkExpirationStatus = checkExpirationStatus;
const jwt_simple_1 = require("jwt-simple");
function encodeSession(secretKey, partialSession) {
    // Always use HS512 to sign the token
    const algorithm = "HS512";
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session = Object.assign(Object.assign({}, partialSession), { issued: issued, expires: expires });
    return {
        token: (0, jwt_simple_1.encode)(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}
function decodeSession(secretKey, tokenString) {
    // Always use HS512 to decode the token
    const algorithm = "HS512";
    let result;
    try {
        result = (0, jwt_simple_1.decode)(tokenString, secretKey, false, algorithm);
    }
    catch (_e) {
        const e = _e;
        // These error strings can be found here:
        // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
        if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
            return {
                type: "invalid-token"
            };
        }
        if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
            return {
                type: "integrity-error"
            };
        }
        // Handle json parse errors, thrown when the payload is nonsense
        if (e.message.indexOf("Unexpected token") === 0) {
            return {
                type: "invalid-token"
            };
        }
        throw e;
    }
    return {
        type: "valid",
        session: result
    };
}
function checkExpirationStatus(token) {
    const now = Date.now();
    if (token.expires > now)
        return "active";
    // Find the timestamp for the end of the token's grace period
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const threeHoursAfterExpiration = token.expires + threeHoursInMs;
    if (threeHoursAfterExpiration > now)
        return "grace";
    return "expired";
}
