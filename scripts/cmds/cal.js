// cal.js
// Show neon glowing monthly calendar image
// Author: Helal (Credit Locked)

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cal",
    aliases: ["সময়", "date"],
    version: "1.2",
    author: "Helal", // 🔒 Credit must remain Helal
    countDown: 3,
    role: 0,
    shortDescription: "Show neon glowing monthly calendar image",
    category: "utility"
  },

  onStart: async function ({ message }) {
    try {
      // 🔒 Credit Lock Check
      const LOCKED_AUTHOR = "Helal";
      const currentAuthor = module.exports?.config?.author || this?.config?.author || null;
      if (currentAuthor !== LOCKED_AUTHOR) {
        return message.reply("❌ This command is credit-locked and cannot run because its author credit was modified.");
      }

      const width = 900;
      const height = 700;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient dark
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f2027");
      grad.addColorStop(1, "#203a43");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Neon text helper
      function neonText(text, x, y, fontSize = 36, color = "#0ff", align = "left") {
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = align;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
      }

      // Draw title - Month Year
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      neonText(`${months[month]} ${year}`, width / 2, 60, 48, "#39ff14", "center");

      // Weekdays header
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const startX = 50;
      const startY = 120;
      const cellWidth = 110;
      const cellHeight = 70;

      for (let i = 0; i < 7; i++) {
        neonText(weekDays[i], startX + i * cellWidth + cellWidth / 2, startY, 32, "#0ff", "center");
      }

      // Calculate first day & days in month
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Draw grid & days
      let dayCounter = 1;
      const rows = 6;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < 7; col++) {
          const x = startX + col * cellWidth;
          const y = startY + 40 + row * cellHeight;

          ctx.lineWidth = 3;
          ctx.strokeStyle = "#0ff";
          ctx.shadowColor = "#0ff";
          ctx.shadowBlur = 15;
          ctx.strokeRect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#121212";
          ctx.fillRect(x + 6, y + 6, cellWidth - 12, cellHeight - 12);

          if ((row === 0 && col < firstDay) || dayCounter > daysInMonth) continue;

          const today = now.getDate();
          if (dayCounter === today) {
            ctx.beginPath();
            ctx.shadowColor = "#39ff14";
            ctx.shadowBlur = 30;
            ctx.fillStyle = "#0a620a";
            ctx.arc(x + cellWidth / 2, y + cellHeight / 2, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          neonText(dayCounter.toString(), x + cellWidth / 2, y + cellHeight / 2 + 15, 40, dayCounter === today ? "#39ff14" : "#0ff", "center");

          dayCounter++;
        }
      }

      // Save file
      const buffer = canvas.toBuffer("image/png");
      const filePath = path.join(__dirname, "neon_calendar.png");
      fs.writeFileSync(filePath, buffer);

      // Send message + photo
      message.reply({
        body: `📅 *${months[month]} ${year}*\n\n🟢 Today is highlighted.`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (error) {
      message.reply("❌ Something went wrong while generating calendar.");
      console.error(error);
    }
  }
};