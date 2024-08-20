require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const token = process.env.YOUR_TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

const app = express();
app.use(bodyParser.json());

const webhookUrl = `${process.env.NGROK_URL}/telegram-webhook`;

bot.setWebHook(webhookUrl)
  .then(() => {
    console.log('Webhook set');
  })
  .catch(error => {
    console.error('Failed to set webhook:', error);
  });

app.post('/telegram-webhook', (req, res) => {
  const update = req.body;

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    if (update.message.text === '/start') {
      bot.sendMessage(chatId, "Нажмите, чтобы посмотреть гороскоп:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть гороскоп",
                web_app: { url: process.env.NGROK_URL }
              }
            ]
          ]
        }
      });
    }
  }

  res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
