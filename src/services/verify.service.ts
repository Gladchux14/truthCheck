import { extractTextFromImage } from './ocr.service';

export const verifyText = async (text: string) => {
    // Basic mock logic for now
    // Later, use NLP, external APIs, or your own database
    const isTrue = text.includes('Nigeria') && text.includes('President');
  
    return {
      input: text,
      verified: isTrue,
      confidence: isTrue ? 0.9 : 0.3,
      source: isTrue ? 'Mocked internal rules' : 'No match found',
    };
  };

// Add image verification using OCR (Tesseract.js)
export const verifyImage = async (imageBuffer: Buffer) => {
  try {
    // Extract text using OCR
    const extractedText = await extractTextFromImage(imageBuffer);
    
    // Simple mock verification logic based on extracted text
    const isTrue = extractedText.includes('Nigeria') && extractedText.includes('President');

    return {
      input: extractedText,
      verified: isTrue,
      confidence: isTrue ? 0.8 : 0.4,
      source: isTrue ? 'OCR + mock verification' : 'No match found',
    };
  } catch (error) {
    throw new Error('Error during image text extraction');
  }
};
