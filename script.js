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
   4. TALK TO THE EXCHANGE RATE API
   frankfurter.app is free and needs no API key
   ========================================== */
async function getExchangeRate() {
  const from = fromSelect.value;
  const to = toSelect.value;

  rateText.textContent = "Fetching rate…";

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const data = await response.json();

    currentRate = data.rates[to];
    rateText.textContent = `1 ${from} = ${currentRate.toFixed(4)} ${to}`;
    updatedText.textContent = "as of " + data.date;

    updateResult(); // recalculate now that we have a fresh rate
  } catch (error) {
    rateText.textContent = "Could not load rate. Check your internet connection.";
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
