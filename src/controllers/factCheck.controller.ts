import { Request, Response } from 'express';
import { FactCheckService } from '../services/factCheck.service';
import { FactCheckRequest } from '../interfaces/factCheck.interface';
import { FactCheckError } from '../utils/factCheckError.class';

export class FactCheckController {
    private factCheckService: FactCheckService;

    constructor() {
        this.factCheckService = new FactCheckService();
    }

    public checkClaim = async (req: Request, res: Response): Promise<void> => {
        try {
            const request: FactCheckRequest = {
                claim: req.body.claim,
                language: req.body.language,
                maxResults: req.body.maxResults
            };

            if (!request.claim) {
                res.status(400).json({
                    success: false,
                    message: 'Claim text is required'
                });
                return;
            }

            const result = await this.factCheckService.checkClaim(request);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            if (error instanceof FactCheckError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    details: error.details
                });
                return;
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
} 