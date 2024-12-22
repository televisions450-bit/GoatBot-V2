const axios = require("axios");

async function queryVanea(prompt, sessionId) {
  try {
    const prefixedQuery = `Vanea ${prompt}`;

    const response = await axios.get("https://api-1-h0sg.onrender.com/Vanea", {
      params: { 
        query: prefixedQuery,
        sessionId // Pass sessionId to API
      },
      timeout: 10000,
    });

    console.log("Full API Response:", response.data);

    return response.data.message || response.data; // Return the response content
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      return `API Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`;
    } else if (error.request) {
      console.error("No Response from API:", error.request);
      return "No response received from the API. Please check your connection.";
    } else {
      console.error("Error:", error.message);
      return `Error: ${error.message}. Please try again later.`;
    }
  }
}

module.exports = {
  config: {
    name: "vanea",
    aliases: ["chat", "ai"],
    version: "1.4",
    author: "Ayanfe",
    longDescription: {
      en: "Interact with Vanea via the provided API and continue chats based on replies.",
    },
    category: "AI",
    guide: {
      en: "{pn} <your query>",
    },
  },

  // Triggered when someone uses the initial command
  onStart: async function ({ message, args, event, api }) {
    const prompt = args.join(" ").trim();
    const userId = event.senderID; // Get the user's ID as the session ID

    message.reaction("⏳", event.messageID);

    if (!prompt) {
      return message.reply("❌ Please provide a query to send to Vanea.");
    }

    try {
      const reply = await queryVanea(prompt, userId); // Pass userId as sessionId
      const sentMessage = await message.reply(reply); // Send reply and store message info
      message.reaction("✅", event.messageID);

      // Save message context for onChat
      this.context = { botMessageID: sentMessage.messageID, userId };
    } catch (error) {
      console.error("Error in command execution:", error.message);
      message.reaction("❌", event.messageID);
      return message.reply("❌ An unexpected error occurred. Please try again later.");
    }
  },

  // Triggered when someone replies to the bot's messages
  onChat: async function ({ message, event, args, api }) {
    try {
      // Check if the reply is directed to the bot's last message
      if (event.messageReply && event.messageReply.messageID === this.context?.botMessageID) {
        const prompt = args.join(" ").trim() || "continue"; // Default prompt if none provided
        const reply = await queryVanea(prompt, this.context.userId); // Use stored userId as sessionId
        const sentMessage = await message.reply(reply);

        // Update botMessageID to handle further replies
        this.context.botMessageID = sentMessage.messageID;
      }
    } catch (error) {
      console.error("Error in onChat:", error.message);
      return message.reply("❌ Something went wrong while continuing the chat.");
    }
  },
};
