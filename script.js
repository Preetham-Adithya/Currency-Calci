/* ==========================================
   1. LIST OF CURRENCIES
   Each one has a name, symbol, and flag emoji.
   Add or remove entries here to change the list.
   ========================================== */
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

// Popular shortcuts shown as quick-pick buttons
const QUICK_PAIRS = [
  ["USD", "INR"],
  ["USD", "EUR"],
  ["GBP", "USD"],
  ["EUR", "JPY"],
  ["USD", "AED"]
];

/* ==========================================
   OFFLINE FALLBACK RATES
   These are approximate reference rates (1 USD = X)
   updated as of July 2026. They let the calculator
   work even with no internet connection or if the
   live API is blocked. Update these numbers now and
   then to keep them roughly accurate.
   ========================================== */
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

// Works out the rate between ANY two currencies using USD as the bridge
function getOfflineRate(from, to) {
  const fromToUsd = 1 / OFFLINE_RATES_FROM_USD[from];
  const usdToTarget = OFFLINE_RATES_FROM_USD[to];
  return fromToUsd * usdToTarget;
}

/* ==========================================
   2. GRAB THE HTML ELEMENTS WE NEED
   ========================================== */
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

let currentRate = null; // stores the latest exchange rate we fetched

/* ==========================================
   3. BUILD THE DROPDOWN MENUS
   ========================================== */
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

// Update the little flag + code badge above each field
function updateFlags() {
  fromFlag.textContent = CURRENCIES[fromSelect.value].flag + " " + fromSelect.value;
  toFlag.textContent = CURRENCIES[toSelect.value].flag + " " + toSelect.value;
}

/* ==========================================
   4. GET THE EXCHANGE RATE
   Step 1: use the offline table immediately, so the
           app never shows "no internet" or a blank result.
   Step 2: try to fetch a live rate in the background.
           If it works, swap in the fresher number.
           If it fails, just keep using the offline one.
   ========================================== */
function useOfflineRate() {
  const from = fromSelect.value;
  const to = toSelect.value;

  currentRate = getOfflineRate(from, to);
  rateText.textContent = `1 ${from} ≈ ${currentRate.toFixed(4)} ${to} (offline reference)`;
  updatedText.textContent = "";
  updateResult();
}

async function getExchangeRate() {
  // Show a result right away using offline numbers
  useOfflineRate();

  // Then quietly try to get a live rate and upgrade if it works
  const from = fromSelect.value;
  const to = toSelect.value;

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const data = await response.json();

    // Only apply this if the user hasn't switched currencies while we waited
    if (fromSelect.value === from && toSelect.value === to) {
      currentRate = data.rates[to];
      rateText.textContent = `1 ${from} = ${currentRate.toFixed(4)} ${to} (live)`;
      updatedText.textContent = "as of " + data.date;
      updateResult();
    }
  } catch (error) {
    // No internet, blocked API, etc. — offline rate set above stays in place.
    console.log("Live rate unavailable, using offline reference rate.");
  }
}

/* ==========================================
   5. DO THE MATH AND SHOW THE RESULT
   ========================================== */
function updateResult() {
  if (currentRate === null) return;

  // Remove commas, e.g. "1,000" -> 1000
  const amount = parseFloat(amountInput.value.replace(/,/g, "")) || 0;
  const converted = amount * currentRate;

  resultDisplay.textContent = converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* ==========================================
   6. SWAP THE TWO CURRENCIES
   ========================================== */
function swapCurrencies() {
  swapBtn.classList.add("spin");
  setTimeout(() => swapBtn.classList.remove("spin"), 400);

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateFlags();
  getExchangeRate();
}

/* ==========================================
   7. QUICK PAIR BUTTONS
   ========================================== */
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

/* ==========================================
   8. EVENT LISTENERS
   (things that run when the user interacts)
   ========================================== */
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

/* ==========================================
   9. RUN EVERYTHING ON PAGE LOAD
   ========================================== */
fillDropdowns();
updateFlags();
buildQuickPairs();
getExchangeRate();
