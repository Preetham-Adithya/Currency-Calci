const CURRENCIES = {
  USD: { flag: "🇺🇸" },
  EUR: { flag: "🇪🇺" },
  GBP: { flag: "🇬🇧" },
  INR: { flag: "🇮🇳" },
  JPY: { flag: "🇯🇵" },
  AUD: { flag: "🇦🇺" },
  CAD: { flag: "🇨🇦" },
  CHF: { flag: "🇨🇭" },
  CNY: { flag: "🇨🇳" },
  SGD: { flag: "🇸🇬" },
  AED: { flag: "🇦🇪" },
  ZAR: { flag: "🇿🇦" }
};

const QUICK_PAIRS = [
  ["USD", "INR"],
  ["USD", "EUR"],
  ["GBP", "USD"],
  ["EUR", "JPY"],
  ["USD", "AED"]
];

const OFFLINE_RATES_FROM_USD = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  INR: 87.5,
  JPY: 156.0,
  AUD: 1.55,
  CAD: 1.41,
  CHF: 0.88,
  CNY: 7.25,
  SGD: 1.35,
  AED: 3.67,
  ZAR: 18.4
};

function getOfflineRate(from, to) {
  const fromToUsd = 1 / OFFLINE_RATES_FROM_USD[from];
  const usdToTarget = OFFLINE_RATES_FROM_USD[to];
  return fromToUsd * usdToTarget;
}

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amountInput");
const resultDisplay = document.getElementById("resultDisplay");
const rateText = document.getElementById("rateText");
const updatedText = document.getElementById("updatedText");
const swapBtn = document.getElementById("swapBtn");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const quickPairsBox = document.getElementById("quickPairs");

let currentRate = null; 

function fillDropdowns() {
  for (const code in CURRENCIES) {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = code;
    fromSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = code;
    option2.textContent = code;
    toSelect.appendChild(option2);
  }
  fromSelect.value = "USD";
  toSelect.value = "INR";
}

function updateFlags() {
  fromFlag.textContent = CURRENCIES[fromSelect.value].flag + " " + fromSelect.value;
  toFlag.textContent = CURRENCIES[toSelect.value].flag + " " + toSelect.value;
}


function useOfflineRate() {
  const from = fromSelect.value;
  const to = toSelect.value;

  currentRate = getOfflineRate(from, to);
  rateText.textContent = `1 ${from} ≈ ${currentRate.toFixed(4)} ${to} (offline reference)`;
  updatedText.textContent = "";
  updateResult();
}

async function getExchangeRate() {
  useOfflineRate();

  const from = fromSelect.value;
  const to = toSelect.value;

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const data = await response.json();

    if (fromSelect.value === from && toSelect.value === to) {
      currentRate = data.rates[to];
      rateText.textContent = `1 ${from} = ${currentRate.toFixed(4)} ${to} (live)`;
      updatedText.textContent = "as of " + data.date;
      updateResult();
    }
  } catch (error) {
    console.log("Live rate unavailable, using offline reference rate.");
  }
}


function updateResult() {
  if (currentRate === null) return;

  const amount = parseFloat(amountInput.value.replace(/,/g, "")) || 0;
  const converted = amount * currentRate;

  resultDisplay.textContent = converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function swapCurrencies() {
  swapBtn.classList.add("spin");
  setTimeout(() => swapBtn.classList.remove("spin"), 400);

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateFlags();
  getExchangeRate();
}

function buildQuickPairs() {
  QUICK_PAIRS.forEach(([from, to]) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = `${from} → ${to}`;

    button.addEventListener("click", () => {
      fromSelect.value = from;
      toSelect.value = to;
      updateFlags();
      getExchangeRate();
    });

    quickPairsBox.appendChild(button);
  });
}

fromSelect.addEventListener("change", () => {
  updateFlags();
  getExchangeRate();
});

toSelect.addEventListener("change", () => {
  updateFlags();
  getExchangeRate();
});

amountInput.addEventListener("input", updateResult);

swapBtn.addEventListener("click", swapCurrencies);

fillDropdowns();
updateFlags();
buildQuickPairs();
getExchangeRate();
