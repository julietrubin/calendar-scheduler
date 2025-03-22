// utils/generateCaption.ts
import axios from "axios";

export const generateCaption = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You're a helpful assistant who writes catchy social media captions. Do not include quotation marks.",
          },
          {
            role: "user",
            content: `Write a short, fun, trendy caption based on: "${prompt}"`,
          },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();
    return aiResponse;
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Couldn't generate caption. Try again!";
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations", 
      {
        prompt: prompt,
        n: 1,
        size: "512x512", 
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};