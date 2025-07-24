const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// console.log("✅ GOOGLE_API_KEY Loaded:", process.env.GOOGLE_API_KEY);
const generateAiResponse = async (code) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful assistant that reviews code and provides feedback. 
Here is the code:\n\n${code}
Please provide a short crisp review of code,errors and any suggestions in short`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};

module.exports = generateAiResponse;
