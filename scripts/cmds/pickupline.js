
const axios = require("axios");

module.exports = {
  config: {
    name: "pickupline",
    aliases: ["pickup", "line"],
    version: "1.0.0",
    author: "ayanfe",
    shortDescription: "Get a random pickup line.",
    longDescription: "Fetch a random pickup line to lighten the mood.",
    category: "fun",
    guide: {
      en: "{pn}"
    },
    usages: "/pickupline",
    cooldowns: 5,
    dependencies: {
      "axios": ""
    }
  },
  onStart: async function({ message, api, args, event }) {
    try {
      const apiKey = 'nexusteam'; 
      const url = `https://apitoxxictechinc.vercel.app/api/lines?apikey=${apiKey}`;

      const response = await axios.get(url);
      const pickupLine = response.data.pickupline;

      await api.sendMessage({
        body: `Here's a random pickup line for you:\n\n"${pickupLine}"`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      await api.sendMessage({
        body: 'Failed to fetch a pickup line. Please try again later.'
      }, event.threadID, event.messageID);
    }
  }
};
