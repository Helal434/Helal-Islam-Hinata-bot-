const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "api",
    version: "2.0",
    author: "Helal",
    countDown: 5,
    role: 2,
    shortDescription: "Show which APIs are used in a command file",
    category: "system",
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔹 Check config.json
      const configPath = path.join(__dirname, "../../config.json");
      if (!fs.existsSync(configPath)) {
        return api.sendMessage("⚠️ config.json not found!", event.threadID, event.messageID);
      }

      const config = require(configPath);
      const owners = config.adminBot || config.botOwner || [];
      const senderID = event.senderID;

      // 🔹 Permission check
      if (!owners.includes(senderID)) {
        return api.sendMessage("⛔ You are not allowed to use this command!", event.threadID, event.messageID);
      }

      // 🔹 Command name check
      if (!args[0]) {
        return api.sendMessage("📘 Usage: /api <commandName>", event.threadID, event.messageID);
      }

      const cmdName = args[0].toLowerCase();
      const cmdPath = path.join(__dirname, `${cmdName}.js`);

      // 🔹 Check file
      if (!fs.existsSync(cmdPath)) {
        return api.sendMessage(`❌ Command file '${cmdName}.js' not found!`, event.threadID, event.messageID);
      }

      // 🔹 Read file content
      const content = fs.readFileSync(cmdPath, "utf8");

      // 🔹 Match API patterns
      const apiMatches = content.match(/https?:\/\/[^\s"'`]+/gi);

      if (!apiMatches) {
        return api.sendMessage(`🧐 No API found in '${cmdName}.js' file.`, event.threadID, event.messageID);
      }

      // 🔹 Unique API links
      const uniqueAPIs = [...new Set(apiMatches)];

      // 🔹 Prepare reply
      const replyMsg = `📄 Source: ${cmdName}.js\n🔍 APIs used: ${uniqueAPIs.join(", ")}`;

      api.sendMessage(replyMsg, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Error while fetching API data.", event.threadID, event.messageID);
    }
  },
};
