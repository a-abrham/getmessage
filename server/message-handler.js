const { getFileInformation } = require('./telegram-bot');
const { MessageModel } = require('./database');

function logMessageInfo(message, prefix = '') {
  const messageId = message.message_id;
  const chatId = message.chat.id;
  const senderUsername = message.from.username || 'N/A';
  const timestamp = new Date(message.date * 1000).toISOString();

  console.log(`${prefix}Received message (${messageId}) from user ${chatId} (${senderUsername}):`);

  const savedMessage = new MessageModel({
    messageId: messageId,
    chatId: chatId,
    senderUsername: senderUsername,
    text: message.text || '',
    photoUrls: [],
    documentUrl: '',
    audioUrl: '',
    videoUrl: '',
    voiceUrl: '',
    timestamp: timestamp,
  });

  const fetchMediaUrlsPromises = [];

  if (message.photo) {
    const photoIds = message.photo.map(photo => photo.file_id);
    console.log(`  Photo(s) received: ${photoIds.join(', ')}`);

    photoIds.forEach(photoId => {
      const photoUrlPromise = getFileInformation(photoId, 'Photo');
      fetchMediaUrlsPromises.push(photoUrlPromise);

      photoUrlPromise.then(photoUrls => {
        savedMessage.photoUrls = savedMessage.photoUrls.concat(Array.isArray(photoUrls) ? photoUrls : [photoUrls]);
      });
    });
  } else if (message.document) {
    console.log(`  Document received: ${message.document.file_id}`);
    const documentUrlPromise = getFileInformation(message.document.file_id, 'Document');
    fetchMediaUrlsPromises.push(documentUrlPromise);

    documentUrlPromise.then(documentUrl => {
    savedMessage.documentUrl = documentUrl ? documentUrl.toString() : '';
  });
  } else if (message.audio) {
    console.log(`  Audio received: ${message.audio.file_id}`);
    const audioUrlPromise = getFileInformation(message.audio.file_id, 'Audio');
fetchMediaUrlsPromises.push(audioUrlPromise);

audioUrlPromise.then(audioUrl => {
  savedMessage.audioUrl = Array.isArray(audioUrl) ? audioUrl[0] : audioUrl.toString();
});

  } else if (message.video) {
    console.log(`  Video received: ${message.video.file_id}`);
  const videoUrlPromise = getFileInformation(message.video.file_id, 'Video');
  fetchMediaUrlsPromises.push(videoUrlPromise);

  videoUrlPromise.then(videoUrl => {
    savedMessage.videoUrl = videoUrl ? videoUrl.toString() : '';
  });
  } else if (message.voice) {
    console.log(`  Voice message received: ${message.voice.file_id}`);
    const voiceUrlPromise = getFileInformation(message.voice.file_id, 'Voice Message');
    fetchMediaUrlsPromises.push(voiceUrlPromise);

    voiceUrlPromise.then(voiceUrls => {
      savedMessage.voiceUrl = Array.isArray(voiceUrls) ? voiceUrls[0] : voiceUrls;
    });
  } else {
    console.log('  No media attachment found.');
  }

  return Promise.all(fetchMediaUrlsPromises)
    .then(() => {
      console.log('All media URLs fetched successfully.');
      return savedMessage.save();
    })
    .then(() => {
      console.log('Message saved to MongoDB');
    })
    .catch(error => {
      console.error('Error saving message to MongoDB:', error);
      throw error;
    });
}

module.exports = {
  logMessageInfo,
};
