const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "anix",
    aliases: ["anixpro"],
    author: "Mahi--",
    version: "2.0",
    cooldowns: 15,
    role: 0,
    shortDescription: "Generate unique anime art from your prompt.",
    longDescription: "Create high-quality anime-style artwork based on your descriptive prompt using the Anix AI.",
    category: "AI Art",
    guide: "{p}anix <your prompt>",
  },

  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("⚠ | Please provide a prompt to generate your anime-style image!", event.threadID);
    }

    const startTime = Date.now();
    api.sendMessage("🎨 | Crafting your anime art... This might take a moment!", event.threadID, event.messageID);

    try {
      const apiUrl = `https://me.hopeless-mahi.000.pe/api/anix?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const imageUrl = response.data.imageUrl;
      if (!imageUrl) {
        return api.sendMessage("❌ | Couldn't generate the image at the moment. Please try again later.", event.threadID);
      }

      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) fs.mkdirSync(cacheFolderPath);

      const imagePath = path.join(cacheFolderPath, `anix_art_${Date.now()}.png`);
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));

      const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
      const stream = fs.createReadStream(imagePath);

      message.reply({
        body: `🌟 | Here’s your anime-style artwork based on the prompt:\n*${prompt}*\n\n🕐 Generated in ${generationTime} seconds.`,
        attachment: stream
      });

    } catch (error) {
      console.error("Anix Image Generation Error:", error);
      return api.sendMessage("❌ | An error occurred. Please try a different prompt or check back later.", event.threadID);
    }
  }
}
