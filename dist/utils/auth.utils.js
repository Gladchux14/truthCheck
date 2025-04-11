"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromResponse = void 0;
const getUserIdFromResponse = (res) => {
    if (!res.locals.session || !res.locals.session.id) {
        throw new Error('User ID not found in session');
    }
    return res.locals.session.id;
};
exports.getUserIdFromResponse = getUserIdFromResponse;
