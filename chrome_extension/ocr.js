import Tesseract from "tesseract.js";

async function extractTextFromImage(imageUrl) {
    const { data: { text } } = await Tesseract.recognize(imageUrl);
    console.log("Extracted Text:", text);
    return text;
}

// Example usage
extractTextFromImage("https://example.com/job-posting.png");
