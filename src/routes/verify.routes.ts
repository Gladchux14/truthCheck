import { Router } from 'express';
import { verifyInformation } from '../controllers/verify.controller';
import multer from 'multer';


const router = Router();

// Set up multer for image upload
const upload = multer({ storage: multer.memoryStorage() });

// Accept text or image
router.post('/', upload.single('image'), verifyInformation);

export default router;