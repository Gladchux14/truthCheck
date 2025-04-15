export interface FactCheckResponse {
    claim: string;
    isVerified: boolean;
    confidence: number;
    sources: Source[];
    summary: {
        rating: string;
        explanation: string;
    };
}

export interface Source {
    url: string;
    title: string;
    publisher: string;
    date: string;
    rating: string;
}

export interface FactCheckRequest {
    claim: string;
    language?: string;
    maxResults?: number;
}

export interface GoogleFactCheckResponse {
    claims: Array<{
        claimReview: Array<{
            url: string;
            title: string;
            publisher: {
                name: string;
            };
            reviewDate: string;
            textualRating: string;
        }>;
    }>;
} 