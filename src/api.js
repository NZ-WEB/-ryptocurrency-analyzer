const API_KEY =
    "4055ed30f566cefff5cf673d1876020e386c6e07eae5ef63a818bb7d343a6725";

// TODO refactor to use URLSearchParams
export const loadTicker = (tickerName) =>
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
    ).then((r) => r.json());

export const loadAllCurrencies = () =>
    fetch(
        "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
    ).then((r) => r.json());