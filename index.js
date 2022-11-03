const telegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "5764899897:AAG70cHBxHyJJjk9sJ3KGMJWPCAouWNbuHw";

const bot = new telegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9 а ты постарайся угадать!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendSticker(
    chatId,
    "https://cdn.tlgrm.app/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/256/3.webp"
  );
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начало пути",
    },
    {
      command: "/info",
      description: "Что я такое",
    },
    {
      command: "/game",
      description: "Играть",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/256/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в игру ${msg.from.first_name}`
      );
    }

    if (text === "/info") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/256/5.webp"
      );
      return bot.sendMessage(
        chatId,
        `Меня сделал мастер йода. И я хочу сыграть с тобой в игру, ${msg.from.first_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(
      chatId,
      `Я тебя не понимаю, попробуй еще раз ввести команду`
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (+data === chats[chatId]) {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/256/5.webp"
      );
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру! ${chats[chatId]}`,
        againOptions
      );
    } else {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/d57/6d1/d576d1b3-d2b5-40de-8c91-f254307bf4be/256/10.webp"
      );
      return await bot.sendMessage(
        chatId,
        `Не правильно. Я загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
