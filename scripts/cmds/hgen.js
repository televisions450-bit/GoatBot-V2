const axios = require('axios');
const { shortenURL, getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "hgen",
    aliases: ["hentaigen"],
    version: "1.0",
    author: "Mahi--",
    countDown: 0,
    longDescription: {
      en: "Generate four NSFW-themed anime images using your prompt text."
    },
    category: "ai",
    role: 0,
    guide: {
      en: "Use this command with your prompt text to generate hentai-themed images."
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return message.reply("❌ | Please provide a prompt to generate the images.");
    }

    message.reply("Generating your images...🍑", async (err, info) => {
      let ui = info.messageID;
      try {
        const apiUrl = `https://mahi-apis.onrender.com/api/hentai?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        const combinedImg = response.data.combinedImage;

        // Send the combined image and wait for user reply
        message.reply({
          body: "💋 | Reply with the image number (1, 2, 3, 4) to get the corresponding high-resolution image.",
          attachment: await getStreamFromURL(combinedImg, "hentai_combined.png")
        }, async (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: response.data.imageUrls
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`❌ | An error occurred: ${error.message}`, event.threadID);
      }
    });
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const reply = parseInt(args[0]);
    const { author, messageID, imageUrls } = Reply;

    if (event.senderID !== author) {
      return message.reply("❌ | You are not authorized to interact with this reply.");
    }

    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[`image${reply}`];
        const shortenedUrl = await shortenURL(img);

        // Send the specific high-resolution image
        const imageStream = await getStreamFromURL(img, `hentai_image${reply}.png`);

        message.reply({
          body: `Here is your selected image: ${shortenedUrl}`,
          attachment: imageStream
        });
      } else {
        message.reply("❌ | Invalid number. Please reply with 1, 2, 3, or 4.");
      }
    } catch (error) {
      console.error(error);
      message.reply(`❌ | An error occurred: ${error.message}`);
    }
  },
}
