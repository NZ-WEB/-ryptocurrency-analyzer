const API_KEY =
  "4055ed30f566cefff5cf673d1876020e386c6e07eae5ef63a818bb7d343a6725";

const AGREGATE_INDEX = "5";

const tickersHendlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);

  if (type !== AGREGATE_INDEX) return;

  const handlers = tickersHendlers.get(currency) ?? [];
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

const subscribeToTickerOnWs = (ticker) => {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
};

const unsubscribeFromTickerOnWs = (ticker) => {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
};

export const loadAllCurrencies = () =>
  fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  ).then((r) => r.json());

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHendlers.get(ticker) || [];
  tickersHendlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHendlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};
