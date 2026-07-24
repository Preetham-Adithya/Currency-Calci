# 💱 Currency Converter

A clean, banknote-inspired currency converter that fetches **live exchange rates** and converts between 12+ world currencies in real time.

**🔗 Live demo:** _add your GitHub Pages link here once deployed_

![Currency Converter preview](preview.png)

## Features

- Live mid-market exchange rates (via the free [frankfurter.app](https://www.frankfurter.app/) API — no API key needed)
- Convert between 12 major currencies with flag badges
- One-click swap between "from" and "to" currencies
- Quick-pick shortcuts for popular currency pairs (USD → INR, GBP → USD, etc.)
- Fully responsive — works on mobile and desktop
- Built with plain HTML, CSS, and JavaScript — no frameworks, no build step

## Tech Stack

- **HTML5** — page structure
- **CSS3** — banknote-themed design (custom properties, flexbox)
- **JavaScript (vanilla)** — fetches rates and handles conversion logic
- **Google Fonts** — Fraunces, Inter, JetBrains Mono
- **frankfurter.app** — free exchange rate API (European Central Bank data)

## Project Structure

```
currency-converter/
├── index.html      # page markup
├── style.css        # all styling
├── script.js         # conversion logic + API calls
├── preview.png       # screenshot (optional, for this README)
└── README.md
```

## Running Locally

No installation needed — it's plain HTML/CSS/JS.

1. Clone or download this repository
2. Open `index.html` in your browser

That's it. An internet connection is needed for it to fetch live rates.

## Deployment

This project is deployed for free using **GitHub Pages**. See the steps in the setup guide, or:

1. Push the code to a GitHub repository
2. Go to **Settings → Pages**
3. Set the source branch to `main` and folder to `/ (root)`
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`

## Credits

Exchange rate data provided by [Frankfurter](https://www.frankfurter.app/), which sources rates from the European Central Bank.

## License

This project is open source and available under the [MIT License](LICENSE).
