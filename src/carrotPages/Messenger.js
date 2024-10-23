import React, { useState } from 'react';
import './Messenger.css';

const Messenger = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

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
    if (!message.trim()) {
      setStatus('Message cannot be empty');
      return;
    }

    setSending(true);
    setStatus('');

    try {
      let finalMessage = message.trim();
      let inlineKeyboard = null;

      // Handle reminder messages
      if (finalMessage.toLowerCase().startsWith('reminder')) {
        finalMessage = finalMessage.substring(8).trim(); // Remove 'reminder'
        inlineKeyboard = {
          inline_keyboard: [
            [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
            [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
          ]
        };
      }

      let response;
      if (finalMessage.toLowerCase() === 'start') {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/trigger-start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: finalMessage,
            inlineKeyboard, // Include the inline keyboard if applicable
          }),
        });
      }

      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus('Error sending message');
      console.error(error);
    } finally {
      setSending(false);
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
          <button onClick={sendMessage} disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
};

export default Messenger;
