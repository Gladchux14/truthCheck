import axios from 'axios';
import { FactCheckResponse, FactCheckRequest, GoogleFactCheckResponse } from '../interfaces/factCheck.interface';
import { FactCheckError, InvalidAPIKeyError, APIQuotaExceededError, InvalidClaimError } from '../utils/factCheckError.class';
import dotenv from 'dotenv';
import https from 'https';

// Load environment variables
dotenv.config();

type AxiosError = {
    response?: {
        status: number;
        data: any;
    };
    code?: string;
    message?: string;
    stack?: string;
    config?: {
        url?: string;
        method?: string;
        params?: any;
        headers?: any;
    };
};

export class FactCheckService {
    private readonly API_KEY: string;
    private readonly BASE_URL: string = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

    constructor() {
        console.log('Environment variables:', {
            GOOGLE_FACT_CHECK_API_KEY: process.env.GOOGLE_FACT_CHECK_API_KEY,
            NODE_ENV: process.env.NODE_ENV
        });
        
        this.API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY || '';
        this.validateAPIKey();
    }

    private validateAPIKey(): void {
        if (!this.API_KEY) {
            throw new InvalidAPIKeyError('API key is missing. Please check your .env file');
        }
        if (this.API_KEY.length < 10) {
            throw new InvalidAPIKeyError('API key appears to be too short');
        }
    }

    private validateClaim(claim: string): void {
        if (!claim || typeof claim !== 'string') {
            throw new InvalidClaimError('Claim must be a non-empty string');
        }
        if (claim.length > 1000) {
            throw new InvalidClaimError('Claim is too long. Maximum length is 1000 characters');
        }
    }

    private handleAPIError(error: AxiosError): never {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    throw new InvalidClaimError('Invalid claim format');
                case 401:
                    throw new InvalidAPIKeyError('API key is invalid or does not have access to Fact Check Tools API');
                case 429:
                    throw new APIQuotaExceededError();
                default:
                    throw new FactCheckError(
                        'Failed to verify claim',
                        error.response.status,
                        error.response.data
                    );
            }
        }
        throw new FactCheckError('Network error while verifying claim');
    }

    async checkClaim(request: FactCheckRequest): Promise<FactCheckResponse> {
        try {
            this.validateClaim(request.claim);

            const params = {
                key: this.API_KEY,
                query: request.claim,
                languageCode: request.language || 'en',
                maxAgeDays: 30,
                pageSize: request.maxResults || 5
            };

            console.log('Making request to Google Fact Check API with params:', params);

            const axiosConfig = {
                params,
                timeout: 10000,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                    keepAlive: true
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            try {
                const response = await axios.get<GoogleFactCheckResponse>(this.BASE_URL, axiosConfig);
                console.log('API Response:', response.data);
                
                if (!response.data.claims || response.data.claims.length === 0) {
                    return {
                        claim: request.claim,
                        isVerified: false,
                        confidence: 0,
                        sources: [],
                        summary: {
                            rating: 'Unverified',
                            explanation: 'No fact-checking sources found for this claim.'
                        }
                    };
                }

                const claims = response.data.claims;
                const sources = claims.map((claim) => ({
                    url: claim.claimReview[0].url,
                    title: claim.claimReview[0].title,
                    publisher: claim.claimReview[0].publisher.name,
                    date: claim.claimReview[0].reviewDate,
                    rating: claim.claimReview[0].textualRating
                }));

                const isVerified = claims.some((claim) => 
                    claim.claimReview[0].textualRating.toLowerCase().includes('true') ||
                    claim.claimReview[0].textualRating.toLowerCase().includes('mostly true')
                );

                const confidence = this.calculateConfidence(claims);
                const summary = this.generateSummary(claims);

                return {
                    claim: request.claim,
                    isVerified,
                    confidence: Math.round(confidence * 100), // Convert to percentage
                    sources,
                    summary
                };
            } catch (error: unknown) {
                const axiosError = error as AxiosError;
                console.error('Detailed Axios Error:', {
                    code: axiosError.code,
                    message: axiosError.message,
                    stack: axiosError.stack,
                    config: axiosError.config
                });
                throw axiosError;
            }
        } catch (error) {
            if (error instanceof FactCheckError) {
                throw error;
            }
            if (error && typeof error === 'object' && 'response' in error) {
                this.handleAPIError(error as AxiosError);
            }
            throw new FactCheckError('Failed to verify claim', 500, error);
        }
    }

    private calculateConfidence(claims: GoogleFactCheckResponse['claims']): number {
        const ratings = claims.map(claim => {
            const rating = claim.claimReview[0].textualRating.toLowerCase();
            if (rating.includes('true')) return 1;
            if (rating.includes('mostly true')) return 0.8;
            if (rating.includes('half true')) return 0.5;
            if (rating.includes('mostly false')) return 0.2;
            return 0;
        });

        const averageRating = ratings.reduce<number>((sum, rating) => sum + rating, 0) / ratings.length;
        return Math.round(averageRating * 100) / 100;
    }

    private generateSummary(claims: GoogleFactCheckResponse['claims']): { rating: string; explanation: string } {
        const ratings = claims.map(claim => claim.claimReview[0].textualRating);
        const mostCommonRating = this.getMostCommonRating(ratings);
        
        return {
            rating: mostCommonRating,
            explanation: this.getExplanationForRating(mostCommonRating)
        };
    }

    private getMostCommonRating(ratings: string[]): string {
        const ratingCounts = ratings.reduce((acc, rating) => {
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(ratingCounts)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    private getExplanationForRating(rating: string): string {
        const ratingLower = rating.toLowerCase();
        if (ratingLower.includes('true')) {
            return 'Multiple reliable sources confirm this claim is true.';
        } else if (ratingLower.includes('mostly true')) {
            return 'The claim is mostly true, with some minor inaccuracies.';
        } else if (ratingLower.includes('half true')) {
            return 'The claim contains both true and false elements.';
        } else if (ratingLower.includes('mostly false')) {
            return 'The claim is mostly false, with some elements of truth.';
        } else if (ratingLower.includes('false')) {
            return 'Multiple reliable sources confirm this claim is false.';
        }
        return 'The claim could not be fully verified.';
    }
}
