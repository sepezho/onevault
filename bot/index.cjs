"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
exports.__esModule = true;
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
require("dotenv/config");
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var SERVER_PORT = process.env.PORT || '3000';
var TOKEN = process.env.TELEGRAM_BOT_TOKEN;
var bot = new node_telegram_bot_api_1["default"](TOKEN || '', { polling: true });
bot.onText(/\/start/, function (msg) {
    var chatId = msg.chat.id;
    var message = "this is derivatives protocol on ton";
    var options = {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'App', web_app: { url: 'https://syntonix.fi/' } }],
            ]
        }
    };
    bot.sendMessage(chatId, message, options);
});
bot.on("polling_error", console.log);
var app = express_1["default"]();
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.set('port', SERVER_PORT);
var server = http_1["default"].createServer(app);
server.listen(SERVER_PORT);
server.on('listening', function () {
    console.info("Listening on " + SERVER_PORT);
});
