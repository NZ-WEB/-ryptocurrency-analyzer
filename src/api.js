const API_KEY =
  "4055ed30f566cefff5cf673d1876020e386c6e07eae5ef63a818bb7d343a6725";

const tickersHendlers = new Map();

// TODO refactor to use URLSearchParams
export const loadTickers = () => {
  if (tickersHendlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHendlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHendlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const loadAllCurrencies = () =>
  fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  ).then((r) => r.json());

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHendlers.get(ticker) || [];
  tickersHendlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHendlers.delete(ticker);
};

setInterval(loadTickers, 5000);
