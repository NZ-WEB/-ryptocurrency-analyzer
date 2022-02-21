<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="loader === true"
      class="
        fixed
        w-100
        h-100
        opacity-80
        bg-purple-800
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
      <the-add-ticker
        @add-ticker="add"
        :tickers="tickers"
        :currencies="currencies"
        :disabled="toManyTickersAdded"
      />
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />

        <div>
          <button
            v-if="page > 1"
            @click="page = page - 1"
            class="
              my-4
              mx-2
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
          >
            Назад
          </button>
          <button
            v-if="hasNextPage"
            @click="page = +page + 1"
            class="
              my-4
              mx-2
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
          >
            Вперёд
          </button>
          <div>Фильтр: <input v-model="filter" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="(ticker, idx) in paginatedTickers"
            :key="idx"
            @click="selectedTicker = ticker"
            :class="{
              'border-2': selectedTicker === ticker,
              'bg-red-100': ticker.status !== 'valid',
            }"
            class="
              bg-white
              overflow-hidden
              rounded-lg
              border-solid
              shadow
              cursor-pointer
            "
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ ticker.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(ticker.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteTicker(ticker)"
              class="
                flex
                items-center
                justify-center
                font-medium
                w-full
                bg-gray-100
                px-4
                py-4
                sm:px-6
                text-md text-gray-500
                hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                transition-all
                focus:outline-none
              "
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - USD
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10 h-10"
          ></div>
        </div>
        <button
          @click="selectedTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
// [×] 6. Наличие в состоянии ЗАВИСИМЫХ ДАННЫХ / Критичность: 5+
// [x] 4. Запросы напрямую внутри компонента (???) / Критичность: 5
// [x] 2. При удалении остается подписка на загрузку тикера | Критичность: 5
// [x] 5. Обработка ошибок API | Критичность: 5
// [x] 3. Количество запросов | Критичность: 4
// [×] 8. При удалении тикера не изменяется localStorage | Критичность: 4
// [×] 1. Одинаковый код в watch | Критичность: 3
// [ ] 9. localStorage и анонимные вкладки | Критичность: 3
// [x] 7. График ужасно выглядит если будет много цен / Критичность: 2
// [ ] 10. Магические строки и числа (URL, 5000 миллисекунд задержки, ключ локалстораджа, количество на странице) / Критичность:

// // Параллельно

// [×] График сломан если везде одинаковые значения
// [x] При удалении стикера остается выбор

import {
  loadAllCurrencies,
  subscribeToTicker,
  unsubscribeFromTicker,
} from "./api";

import TheAddTicker from "./components/TheAddTicker.vue";

export default {
  name: "App",

  components: {
    TheAddTicker,
  },

  data() {
    return {
      loader: false,
      selectedTicker: null,
      isValid: true,
      tickers: [],
      tickerIsAlreadyUsed: false,
      graph: [],
      page: 1,
      filter: "",
      maxGraphElements: 1,
      currencies: [],
    };
  },
  computed: {
    toManyTickersAdded() {
      return this.tickers.length > 4;
    },

    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.includes(this.filter.toUpperCase())
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const minV = Math.min(...this.graph);
      const maxV = Math.max(...this.graph);

      if (maxV === minV) {
        return this.graph.map(() => 50);
      }

      return this.graph
        .filter((value) => value && typeof value == "number")
        .map((price) => 10 + ((price - minV) * 90) / (maxV - minV));
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  methods: {
    updateTicker(tickerName, value) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (value === "ERROR") {
            t.status = "ERROR";
            t.price = "-";
          }

          if (
            t.name === this.selectedTicker?.name &&
            this.selectedTicker !== null
          ) {
            this.addToGraph(t.name, t.price);
          }

          t.price = value;
        });
    },

    add(ticker) {
      const newTicker = {
        name: ticker,
        price: "-",
        status: "valid",
      };

      if (newTicker.name === "") {
        this.isValid === false;
      }
      if (this.tickers.find((t) => t.name === newTicker.name) !== undefined) {
        this.isValid = false;
        this.tickerIsAlreadyUsed = true;
      }

      if (this.isValid) {
        this.tickers = [...this.tickers, newTicker];
        this.filter = "";

        subscribeToTicker(newTicker.name, (value) =>
          this.updateTicker(newTicker.name, value)
        );
      }
    },

    deleteTicker(ticker) {
      this.tickers = this.tickers.filter((t) => t.name !== ticker.name);
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
      if (this.selectedTicker == ticker) {
        this.selectedTicker = null;
      }

      unsubscribeFromTicker(ticker.name);
    },

    async getAllCurrencies() {
      this.loader = true;
      const currenciesResponseData = await loadAllCurrencies();
      this.currencies = Object.keys(currenciesResponseData.Data);
      this.loader = false;
    },

    formatPrice(price) {
      if (price === "-") {
        return price;
      }

      if (price === "ERROR") {
        return "-";
      }

      if (!price) {
        price = "-";
        return price;
      }

      price > 1 ? (price = price.toFixed(2)) : (price = price.toPrecision(2));
      return price;
    },

    addToGraph(name, price) {
      this.$nextTick(() => {
        this.calculateMaxGraphElements();
      });

      while (this.graph.length > this.maxGraphElements) {
        this.graph.shift();
      }

      if (this.selectedTicker?.name === name) {
        this.graph.push(price);
      }
    },

    calculateMaxGraphElements() {
      if (!this.$refs.graph) {
        return;
      }

      this.maxGraphElements = this.$refs.graph.clientWidth / 38;
    },
  },

  mounted() {
    this.getAllCurrencies();

    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) =>
        subscribeToTicker(ticker.name, (value) =>
          this.updateTicker(ticker.name, value)
        )
      );
    }
  },
  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0) {
        this.page = Math.max(1, this.page - 1);
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
  },
};
</script>

<style src="./app.css"></style>
