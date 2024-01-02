const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://abrshkorra:wZKjYPwJFvuDhtvF@telegramgcmsg.osalm2g.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI);

const MessageSchema = new mongoose.Schema({
  messageId: Number,
  chatId: Number,
  senderUsername: String,
  text: String,
  photoUrls: [String],
  documentUrl: String,
  audioUrl: String,
  videoUrl: String,
  voiceUrl: String,
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = {
  MessageModel,
};
