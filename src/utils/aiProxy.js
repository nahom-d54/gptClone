const proxyRequest = async (request) => {
  try {
    const { messages, temperature } = request;

    // Send request to OpenAI API
    const response = await axios.post(
      process.env.AI_API_URL,
      {
        model: "grok-beta",
        messages,
        temperature,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_API_KEY}`, // Set your API key in .env
        },
      }
    );

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
