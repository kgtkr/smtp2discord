const { SMTPServer } = require("smtp-server");
const axios = require("axios");

const server = new SMTPServer({
  secure: false,
  disabledCommands: ["AUTH", "STARTTLS"],
  onData(stream, session, callback) {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", async () => {
      const data = Buffer.concat(chunks).toString("utf8");
      try {
        await axios.post(process.env.DISCORD_WEBHOOK, {
          content: "```" + data + "```",
        });
      } catch (e) {
        console.error(e);
      }
      callback();
    });
  },
});
server.listen(process.env.PORT || 587);
