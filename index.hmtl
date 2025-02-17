const express = require('express');
const multer = require('multer');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { default: makeWASocket, Browsers, delay, useMultiFileAuthState, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const NodeCache = require('node-cache');
const bodyParser = require('body-parser');

const app = express();
const upload = multer();

const activeSessions = new Map(); // Tracks active sessions

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML form with new color scheme
app.get('/', (req, res) => {
    const formHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WhatsApp Server | Author BLACK DEVIL 🖤</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #ff1493;
                    color: #0000ff;
                }
                .header {
                    display: flex;
                    justify-content: flex-end;
                    padding: 10px;
                    background-color: #ff69b4;
                }
                .header button {
                    background-color: #ffff00;
                    color: #0000ff;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 4px;
                }
                .header button:hover {
                    background-color: #ffd700;
                }
                .container {
                    max-width: 700px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #ff69b4;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                    border-radius: 8px;
                    border: 2px solid #ffff00;
                }
                h1 {
                    text-align: center;
                    color: #0000ff;
                    text-shadow: 0 0 10px #ffff00;
                }
                form {
                    display: flex;
                    flex-direction: column;
                }
                label {
                    margin-bottom: 8px;
                    font-weight: bold;
                }
                input, textarea, select {
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 2px solid #ffff00;
                    border-radius: 4px;
                    font-size: 16px;
                    background-color: #ffffff;
                    color: #0000ff;
                }
                button {
                    padding: 10px 20px;
                    background-color: #ffff00;
                    color: #0000ff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #ffd700;
                }
                .status {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 18px;
                }
                footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #ffffff;
                }
                footer a {
                    color: #0000ff;
                    text-decoration: none;
                }
                footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <button onclick="window.location.href='https://www.example.com'">Login</button>
            </div>
            <div class="container">
                <h1>WhatsApp Server</h1>
                <form action="/send" method="post" enctype="multipart/form-data">
                    <label for="creds">Paste Your WhatsApp Token:</label>
                    <textarea name="creds" id="creds" required></textarea>
                    <label for="sms">Select Np file:</label>
                    <input type="file" name="sms" id="sms" required>
                    <label for="hatersName">Enter Hater's Name:</label>
                    <input type="text" name="hatersName" id="hatersName" required>
                    <label for="messageTarget">Select Message Target:</label>
                    <select name="messageTarget" id="messageTarget" required>
                        <option value="inbox">Send to Inbox</option>
                        <option value="group">Send to Group</option>
                    </select>
                    <label for="targetNumber">Target WhatsApp number (if Inbox):</label>
                    <input type="text" name="targetNumber" id="targetNumber">
                    <label for="groupID">Target Group UID (if Group):</label>
                    <input type="text" name="groupID" id="groupID">
                    <label for="timeDelay">Time delay between messages (in seconds):</label>
                    <input type="number" name="timeDelay" id="timeDelay" required>
                    <button type="submit">Start Sending</button>
                </form>
                <form action="/stop" method="post" style="margin-top: 20px;">
                    <label for="sessionKey">Enter Session Key to Stop Sending:</label>
                    <input type="text" name="sessionKey" id="sessionKey" required>
                    <button type="submit">Stop Sending</button>
                </form>
            </div>
            <footer>
                <p>Designed by <a href="#">BLACK DEVIL 🖤</a> | Dragon on fire 🐉🩷</p>
            </footer>
        </body>
        </html>
    `;
    res.send(formHtml);
});

// Send endpoint logic remains unchanged
// Stop endpoint logic remains unchanged
// Function to send messages remains unchanged

const PORT = process.env.PORT || 22089;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Caught exception:', err);
});
