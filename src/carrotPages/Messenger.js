import React, { useState, useRef } from 'react';
import './Messenger.css';

const Messenger = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [attachment, setAttachment] = useState(null); // State for managing attachment
  const [attachmentType, setAttachmentType] = useState(''); // Track attachment type
  const fileInputRef = useRef(null); // Reference for the file input

  const validatePasscode = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/validate-passcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      const result = await response.json();
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setStatus('Invalid passcode');
      }
    } catch (error) {
      setStatus('Error validating passcode');
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !attachment) {
      setStatus('Message or attachment must be provided');
      return;
    }

    setSending(true);
    setStatus('');

    try {
      let finalMessage = message.trim();
      let inlineKeyboard = null;

      // Handle "reminder" messages with predefined inline keyboards
      if (finalMessage.toLowerCase().startsWith('reminder')) {
        finalMessage = finalMessage.substring(8).trim();
        inlineKeyboard = {
          inline_keyboard: [
            [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
            [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }],
          ],
        };
      }

      // Special handling for "start" message
      if (finalMessage.toLowerCase() === 'start') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/trigger-start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        setStatus(result.message);
        return; // Exit to avoid additional processing
      }

      // Create FormData for mixed content
      const formData = new FormData();
      if (finalMessage) formData.append('messageTemplate', finalMessage);
      if (attachment) {
        formData.append('attachment', attachment);
        formData.append('attachmentType', attachmentType); // Pass the attachment type
      }
      if (inlineKeyboard) formData.append('inlineKeyboard', JSON.stringify(inlineKeyboard));

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-message`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus('Error sending message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const mimeType = file.type;

    // Validate the MIME type
    if (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType === 'image/gif' ||
      mimeType === 'application/x-sticker' ||
      mimeType.startsWith('application/')
    ) {
      setAttachment(file); // Set the selected file
      setAttachmentType(
        mimeType.startsWith('image/')
          ? 'photo'
          : mimeType.startsWith('video/')
          ? 'video'
          : mimeType === 'image/gif'
          ? 'animation'
          : mimeType === 'application/x-sticker'
          ? 'sticker'
          : 'document'
      );
    } else {
      setStatus('Unsupported file type. Please select a valid media file.');
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="messenger">
      {!isAuthenticated ? (
        <div>
          <h2>Enter Passcode</h2>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
          />
          <button onClick={validatePasscode}>Submit</button>
          {status && <p>{status}</p>}
        </div>
      ) : (
        <div>
          <h2>Send Message to All Telegram Bot Users</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          ></textarea>
          <div className="attachment-row">
            <label className="file-input">
              <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} />
              <span>Choose File</span>
            </label>
            {attachment && (
              <div className="attachment-info">
                <span>{attachment.name} ({attachmentType})</span>
                <button className="remove-attachment" onClick={removeAttachment}>
                  ❌
                </button>
              </div>
            )}
            <button className="send-message" onClick={sendMessage} disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
};

export default Messenger;
