const axios = require('axios');
const google = require('googlethis');

module.exports = {
    config: {
        name: "lyrics",
        description: "Get lyrics for a song",
        usage: "/lyrics <song name>",
        cooldown: 3,
        aliases: ['ly'],
        author: "Ayanfe" 
    },

    onStart: async function({ api, event, message, args }) {
        if (!args[0]) {
            return api.sendMessage("⚠️ Please provide a song name!", event.threadID, event.messageID);
        }

        const songName = args.join(' ');
        let processingMessage;

        try {
            processingMessage = await api.sendMessage("🎵 Searching for lyrics...", event.threadID);

            const res = await google.search("lyrics " + songName);

            if (res.knowledge_panel && res.knowledge_panel.lyrics) {
                const formattedLyrics = 
                    "🎸 Lyrics Found\n" +
                    "━━━━━━━━━━━━━━━\n\n" +
                    res.knowledge_panel.lyrics +
                    "\n\n━━━━━━━━━━━━━━━\n" +
                    "🎼 End of Lyrics";
                await api.sendMessage(
                    formattedLyrics,
                    event.threadID,
                    () => {
                        api.unsendMessage(processingMessage.messageID);
                    },
                    event.messageID
                );
            } else {
                api.unsendMessage(processingMessage.messageID);
                return api.sendMessage(
                    "❌ Lyrics not found. Please try another song.",
                    event.threadID,
                    event.messageID
                );
            }

        } catch (error) {
            console.error('Lyrics Error:', error);
            if (processingMessage) api.unsendMessage(processingMessage.messageID);
            api.sendMessage(
                "❌ An error occurred while fetching the lyrics.",
                event.threadID,
                event.messageID
            );
        }
    }
};
