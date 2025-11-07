const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "say",
    version: "1.0",
    author: "Helal (Credit Locked)",
    countDown: 5,
    role: 0,
    shortDescription: "AI voice generator (Bangla + English auto detect)",
    longDescription: "Converts your text into natural AI voice. Supports Bangla and English automatically.",
    category: "AI",
    guide: "{pn} <text>\nExample:\n{pn} হ্যালো কেমন আছো\n{pn} Hello, how are you?"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ Please write something to generate voice!");

    const text = args.join(" ");
    message.reply(`🎤 Generating voice for:\n「 ${text} 」`);

    // Auto-detect language (Bangla letters = bn, else en)
    const isBangla = /[অ-হা-্০-৯]/.test(text);
    const lang = isBangla ? "bn" : "en";

    try {
      const voiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${lang}&client=tw-ob`;

      const filePath = path.join(__dirname, "cache", `voice_${Date.now()}.mp3`);
      const { data } = await axios.get(voiceUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, data);

      await message.reply({
        body: `✅ Here’s your ${lang === "bn" ? "Bangla" : "English"} AI voice:`,
        attachment: fs.createReadStream(filePath),
      });

      // Auto clean after 10 seconds
      setTimeout(() => fs.unlinkSync(filePath), 10000);
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to generate voice. Please try again later.");
    }
  }
};
