
import { Request, Response, NextFunction } from "express";
import {Session, PartialSession, EncodeResult,DecodeResult, ExpirationStatus} from '../interfaces/auth.interface'
import {decodeSession, checkExpirationStatus, encodeSession} from '../configs/jwt';
import config from "../configs/config";
import { json } from "express";


/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    const unauthorized = (message: string) => response.status(401).json({
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


    const decodedSession: DecodeResult = decodeSession(config.jwt.access_token, token);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;

    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = encodeSession(config.jwt.access_token, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };

        response.setHeader(responseHeader, token);
    } else {
        session = decodedSession.session;
    }

    // Set the session on response.locals object for routes to access
    response.locals = {
        ...response.locals,
        session: session
    };

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}
