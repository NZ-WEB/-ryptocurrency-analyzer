const API_KEY =
    "4055ed30f566cefff5cf673d1876020e386c6e07eae5ef63a818bb7d343a6725";

const tickers = new Map();

// TODO refactor to use URLSearchParams
export const loadTickers = (tickers) =>
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ","
    )}&tsyms=USD&api_key=${API_KEY}`
    )
    .then((r) => r.json())
    .then((rawData) =>
        Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [key, value.USD])
        )
    );

export const loadAllCurrencies = () =>
    fetch(
        "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
    ).then((r) => r.json());

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || [];
    tickers.set(
        ticker,
        subscribers.filter((fn) => fn !== cb)
    );
};