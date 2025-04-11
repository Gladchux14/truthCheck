import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    Tesseract.recognize(
      imageBuffer,
      'eng', // Use English language model (you can add more languages if needed)
      {
        logger: (m) => console.log(m), // Optional: To log progress
      }
    )
      .then(({ data: { text } }) => resolve(text)) // Extracted text from the image
      .catch((error) => reject(error)); // Reject on failure
  });
};