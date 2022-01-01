const { SMTPServer } = require("smtp-server");
const axios = require("axios");
const { simpleParser } = require("mailparser");

const server = new SMTPServer({
  secure: false,
  disabledCommands: ["AUTH", "STARTTLS"],
  async onData(stream, session, callback) {
    const mail = await simpleParser(stream);
    console.log("received mail", JSON.stringify(mail, null, 2));
    try {
      await axios.post(process.env.DISCORD_WEBHOOK, {
        username: "smtp2discord",
        content: "New mail received",
        embeds: [
          {
            title: mail.subject,
            description: mail.text,
            fields: mail.headerLines.map(({ key, line: value }) => ({
              name: key,
              value: value,
              inline: true,
            })),
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
    callback();
  },
});
server.listen(process.env.PORT || 587);
