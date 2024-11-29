const axios = require("axios");

const proxyRequest = async (request) => {
  try {
    const { messages, temperature } = request;

    const prompt = {
      model: "grok-beta",
      messages,
      temperature,
      stream: false,
    };

    console.log(prompt);
    const response = await axios.post(process.env.AI_API_URL, prompt, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`, // Set your API key in .env
      },
    });

    // Send the response back to the client
    return response.data;
  } catch (error) {
    console.error(
      "Error communicating with AI API:",
      error.response?.data || error.message
    );
    return (
      error.response?.data || "An error occurred while processing your request."
    );
  }
};

module.exports = { proxyRequest };
