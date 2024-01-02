const TelegramBot = require('node-telegram-bot-api');
const { MessageModel } = require('./database');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

function setupWebhook(app) {
  app.post('/webhook', (req, res) => {
    const { message } = req.body;

    if (message) {
      handleIncomingMessage(message);
    }

    res.status(200).end();
  });
}

function getFileInformation(fileId, fileType, mediaUrlField) {
  if (!Array.isArray(mediaUrlField)) {
    mediaUrlField = [];
  }

  return bot.getFile(fileId)
    .then((fileInfo) => {
      const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;
      console.log(`  ${fileType} URL: ${fileUrl}`);

      mediaUrlField.push(fileUrl);
      return mediaUrlField;
    })
    .catch((error) => {
      console.error(`Error getting ${fileType.toLowerCase()} information:`, error);
    });
}

bot.on('message', (msg) => {
  handleIncomingMessage(msg);
});

module.exports = {
  setupWebhook,
  getFileInformation,
};

const { logMessageInfo } = require('./message-handler');

function handleIncomingMessage(message) {
  logMessageInfo(message);
}
