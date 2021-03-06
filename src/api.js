// Если монета не корректна, добавить класс bg-red-100
// если монетка не существует, приходит сообщение INVALID SUB

const API_KEY =
  "4055ed30f566cefff5cf673d1876020e386c6e07eae5ef63a818bb7d343a6725";

const AGREGATE_INDEX = "5";

const tickersHendlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  let {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    MESSAGE: message,
    PARAMETER: param
  } = JSON.parse(e.data);

  if (!currency && message === "INVALID_SUB") {
    currency = param.split("~")[2];
  }

  if (param && param.split("~")[3] === "BTC" && message == "INVALID_SUB") {
    unsubscribeFromTickerOnWs(currency, "BTC");
    return;
  }

  const handlers = tickersHendlers.get(currency) ?? [];

  if (subISInvalud(message, currency, handlers)) {
    return;
  }

  if (type !== AGREGATE_INDEX || newPrice == undefined) return;

  handlers.forEach((fn) => fn(newPrice));
});

const sendToWs = (message) => {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
};

const subscribeToTickerOnWs = (ticker, to = "USD") => {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${to}`]
  });
};

const unsubscribeFromTickerOnWs = (ticker, to = "USD") => {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${to}`]
  });
};

const subISInvalud = (message, currency, handlers) => {
  if (message === "INVALID_SUB") {
    unsubscribeFromTicker(currency);

    subscribeToTickerOnWs(currency, "BTC");

    handlers.forEach((fn) => fn("ERROR"));
    return true;
  } else {
    return false;
  }
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHendlers.get(ticker) || [];
  tickersHendlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHendlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export const loadAllCurrencies = () =>
  fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  ).then((r) => r.json());
