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
            content: "You're a helpful assistant who writes catchy social media captions.",
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
