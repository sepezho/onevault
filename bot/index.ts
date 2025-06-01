import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';
import 'dotenv/config'
import http from 'http';
import express from 'express';

const SERVER_PORT = process.env.PORT || '30912';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(TOKEN || '', { polling: true });

bot.onText(/\/start/, (msg: any) => {
  const chatId = msg.chat.id;

  const message = `OneVault. Staking from TON & TG on EVM via layer zero`;
  const options: SendMessageOptions = {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard:
        [
          [{ text: 'App', web_app: { url: 'http://localhost:3000/' } }], // todo deploy app and replace URL
        ]
    },

  };

  bot.sendMessage(chatId, message, options);
});


bot.on("polling_error", console.log);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('port', SERVER_PORT);

const server = http.createServer(app);
server.listen(SERVER_PORT);

server.on('listening', () => {
  console.info(`Listening on ${SERVER_PORT}`);
});
