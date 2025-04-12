export class FactCheckError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message);
        this.name = 'FactCheckError';
    }
}

export class InvalidAPIKeyError extends FactCheckError {
    constructor(message: string = 'Invalid Google Fact Check API key') {
        super(message, 401);
    }
}

export class APIQuotaExceededError extends FactCheckError {
    constructor() {
        super('API quota exceeded', 429);
    }
}

export class InvalidClaimError extends FactCheckError {
    constructor(message: string) {
        super(message, 400);
    }
} 