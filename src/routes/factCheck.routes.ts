import { Router } from 'express';
import { FactCheckController } from '../controllers/factCheck.controller';
import { factCheckLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();
const factCheckController = new FactCheckController();

/**
 * @swagger
 * /api/fact-check:
 *   post:
 *     summary: Check the veracity of a claim
 *     tags: [Fact Check]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - claim
 *             properties:
 *               claim:
 *                 type: "string"
 *                 description: "The claim to be verified"
 *               language:
 *                 type: "string"
 *                 description: "Language code (default: en)"
 *               maxResults:
 *                 type: "number"
 *                 description: "Maximum number of results to return (default: 5)"
 *     responses:
 *       200:
 *         description: "Successfully checked the claim"
 *       400:
 *         description: "Invalid request"
 *       401:
 *         description: "Invalid API key"
 *       429:
 *         description: "Too many requests"
 *       500:
 *         description: "Server error"
 */
router.post('/', factCheckLimiter, factCheckController.checkClaim);

export default router; 