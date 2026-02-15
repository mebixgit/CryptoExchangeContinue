# CryptoExchange - Multi-Provider Price Comparison Platform

A full-featured cryptocurrency exchange web application that integrates with multiple exchange providers (Binance, Coinbase, Kraken) for real-time price comparison and trading analysis.

## Features

### 🎯 Core Features
- **Live Price Dashboard** - Real-time cryptocurrency prices from multiple providers
- **Price Comparison** - Side-by-side comparison of exchange rates across providers
- **Exchange Interface** - Get the best exchange quotes for crypto swaps
- **Provider Status** - Monitor health and availability of all integrated providers
- **Dark/Light Theme** - Toggle between themes with preference persistence
- **Responsive Design** - Mobile-friendly interface that works on all devices

### 💱 Supported Providers
- **Binance** - World's largest cryptocurrency exchange
- **Coinbase** - Trusted US-based exchange platform
- **Kraken** - Secure and established exchange

### 📊 Supported Cryptocurrencies
BTC, ETH, SOL, XRP, ADA, DOGE, MATIC, DOT, LTC, LINK, and more

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Charting library (ready for implementation)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Axios** - HTTP client for provider APIs
- **CORS** - Cross-origin resource sharing

## Project Structure

```
/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriceCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── Exchange.jsx
│   │   │   └── ProviderStatus.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useApi.js
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── context/         # React context
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/           # Utility functions
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── prices.js
│   │   │   ├── providers.js
│   │   │   ├── markets.js
│   │   │   └── exchange.js
│   │   ├── providers/       # Exchange provider integrations
│   │   │   ├── binance.js
│   │   │   ├── coinbase.js
│   │   │   └── kraken.js
│   │   └── middleware/      # Express middleware
│   │       └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   └── index.js
├── package.json             # Root package.json with workspace scripts
├── .gitignore
└── README.md
```

## API Endpoints

### Prices
- `GET /api/prices` - Get current prices from all providers
- `GET /api/prices/:symbol` - Get detailed price info for a specific crypto

### Exchange
- `GET /api/exchange/quote?from=BTC&to=ETH&amount=1` - Get exchange quotes
- `GET /api/exchange/compare/:pair` - Compare prices for a trading pair

### Providers
- `GET /api/providers/status` - Get status of all providers

### Markets
- `GET /api/markets` - Get available markets/trading pairs

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CryptoExchangeContinue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Server configuration:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` if needed (defaults work for development):
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the application**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 3001) and frontend dev server (port 5173).
   
   Alternatively, start them separately:
   ```bash
   # Terminal 1 - Start backend
   npm run dev:server
   
   # Terminal 2 - Start frontend
   npm run dev:client
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## Usage

### Dashboard
- View real-time prices for top cryptocurrencies
- See best buy/sell prices across all providers
- Monitor 24h price changes
- Auto-refreshes every 30 seconds

### Price Comparison
- Select two cryptocurrencies to compare
- View exchange rates from all providers
- See 24h price changes for both assets
- Compare which provider offers the best rate

### Exchange Interface
- Enter amount to exchange
- Select source and target currencies
- Get quotes from all providers
- See the recommended provider with the best rate
- View detailed breakdown including fees

### Provider Status
- Monitor health of all exchange providers
- Check connection status and latency
- View last update timestamps
- Auto-refreshes every 60 seconds

## Development

### Available Scripts

Root level:
- `npm run dev` - Start both frontend and backend
- `npm run dev:server` - Start backend only
- `npm run dev:client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm start` - Start production backend server

Client:
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

Server:
- `npm run dev` - Start with auto-reload
- `npm start` - Start production server

## Features in Detail

### Public API Integration
All provider integrations use public endpoints that don't require API keys, making it easy to get started without configuration.

### Error Handling
- Graceful degradation when providers are unavailable
- Loading states for all async operations
- User-friendly error messages
- Automatic retry logic for failed requests

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface elements
- Optimized layouts for all screen sizes

### Theme Support
- Light and dark modes
- Preference saved to localStorage
- Smooth transitions between themes
- Accessible color contrasts

## API Rate Limits

Each provider has its own rate limits for public endpoints:
- **Binance**: 1200 requests per minute
- **Coinbase**: 10,000 requests per hour
- **Kraken**: 1 request per second (public endpoints)

The application implements intelligent caching and request batching to stay within these limits.

## Troubleshooting

### Port already in use
If ports 3001 or 5173 are in use:
```bash
# Change server port in server/.env
PORT=3002

# Change client port in client/vite.config.js
server: { port: 5174 }
```

### CORS errors
Make sure the `CLIENT_URL` in `server/.env` matches your frontend URL.

### Provider timeout
Some providers may be temporarily unavailable. The app will continue to work with available providers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Exchange data provided by Binance, Coinbase, and Kraken public APIs
- Built with modern React and Node.js best practices
- Inspired by popular crypto exchange interfaces
