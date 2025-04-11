import { Request, Response } from 'express';
import { verifyText, verifyImage } from '../services/verify.service';

export const verifyInformation = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const image = req.file;

    if (!text && !image) {
      res.status(400).json({ message: 'Please provide text or image for verification.' });
    }

    // If it's a text input
    if (text) {
      const result = await verifyText(text);
      res.status(200).json({ success: true, result });
    }

    // If it's an image
    if (image) {
      const result = await verifyImage(image.buffer);
      res.status(200).json({ success: true, result });
    }

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};

