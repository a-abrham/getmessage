async function fetchAndDisplayMessages() {
    
    const response = await fetch('http://localhost:3005/chatName/-1001991429503');
    const chatName = await response.json();
    document.querySelector('.chat-header').textContent = chatName;

    try {
        const response = await fetch('http://localhost:3005/messages/-1001991429503');
        const messages = await response.json();

        const chatMessagesContainer = document.getElementById('chatMessages');
        let currentDay;

        messages.forEach(message => {
            const messageTime = new Date(message.timestamp);
            const day = messageTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

            if (day !== currentDay) {
                const dayContainer = document.createElement('div');
                dayContainer.className = 'day-container';

                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                dayHeader.textContent = day;

                dayContainer.appendChild(dayHeader);
                chatMessagesContainer.appendChild(dayContainer);

                currentDay = day;
            }

            const messageElement = document.createElement('div');
            messageElement.className = 'message';

            const timeElement = document.createElement('span');
            timeElement.className = 'message-time';
            timeElement.textContent = formatTime(messageTime);
            messageElement.appendChild(timeElement);

            const senderElement = document.createElement('span');
            senderElement.className = 'message-sender';
            senderElement.textContent = `${message.senderUsername}:`;
            messageElement.appendChild(senderElement);

            const textElement = document.createElement('span');
            textElement.className = 'message-text';

            if (message.photoUrls && message.photoUrls.length > 0) {
                message.photoUrls.forEach(photoUrl => {
                    const imgElement = document.createElement('img');
                    imgElement.src = photoUrl;
                    imgElement.alt = 'Image';
                    textElement.appendChild(imgElement);
                });
            } else if (message.videoUrl) {
                const videoElement = document.createElement('video');
                videoElement.src = message.videoUrl;
                videoElement.controls = true;
                textElement.appendChild(videoElement);
            } else if (message.documentUrl) {
                const documentLink = document.createElement('a');
                documentLink.href = message.documentUrl;
                documentLink.textContent = 'Download Document';
                textElement.appendChild(documentLink);
            } else if (message.audioUrl) {
                const audioElement = document.createElement('audio');
                audioElement.src = message.audioUrl;
                audioElement.controls = true;
                textElement.appendChild(audioElement);
            } else if (message.voiceUrl) {
                const voiceElement = document.createElement('audio');
                voiceElement.src = message.voiceUrl;
                voiceElement.controls = true;
                textElement.appendChild(voiceElement);
            } else {
                textElement.textContent = message.text || 'No text';
            }

            messageElement.appendChild(textElement);
            chatMessagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

window.onload = fetchAndDisplayMessages;