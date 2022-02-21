<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @input="onInput"
            v-model="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="(item, idx) in filteredCurrencies"
            :key="idx"
            @click="addWithAutocomplite(item)"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
          >
            {{ item }}
          </span>
        </div>
        <div v-if="tickerIsAlreadyUsed" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <the-add-button
      @click="add"
      type="button"
      class="my-4 inline-flex items-center"
      :disabled="disabled"
    />
  </section>
</template>

<script>
import TheAddButton from "./TheAddButton.vue";

export default {
  props: {
    tickers: Object,
    currencies: Array,
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: {
    "add-ticker": (value) => typeof value === "string",
  },

  components: {
    TheAddButton,
  },

  data() {
    return {
      ticker: "",
      isValid: true,
      tickerIsAlreadyUsed: false,
      filteredCurrencies: [],
    };
  },

  methods: {
    onInput() {
      this.isValid = true;
      this.tickerIsAlreadyUsed = false;

      this.currencies.forEach((item) => {
        if (item.includes(this.ticker.toUpperCase())) {
          this.filteredCurrencies.push(item);
        }
      });

      this.filteredCurrencies.sort((a, b) => a - b);

      if (this.filteredCurrencies.length > 4) {
        this.filteredCurrencies.length = 4;
      }
    },

    add() {
      const newTicker = {
        name: this.ticker,
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
        this.$emit("add-ticker", this.ticker);
        this.ticker = "";
      }
    },

    addWithAutocomplite(item) {
      this.ticker = item;
      this.add();
      this.clear();
    },

    clear() {
      this.ticker = "";
    },
  },
};
</script>

<style></style>
