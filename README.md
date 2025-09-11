# NameNest

A comprehensive decentralized domain marketplace built with React, featuring real-time domain trading, portfolio management, and secure messaging through Doma Protocol integration.

## 🌟 Overview

NameNest is a next-generation domain marketplace that enables users to buy, sell, and trade tokenized domains across multiple blockchains. Built with modern web technologies and integrated with Doma Protocol, it provides a seamless experience for domain trading with real-time updates, secure messaging, and comprehensive portfolio management.

## 🚀 Key Features

### 🏷️ **Domain Marketplace**
- **Multi-Chain Support**: Trade domains on Ethereum, Polygon, and Solana
- **Real-Time Listings**: Live updates of domain availability and pricing
- **Advanced Search**: Filter by TLD, price range, network, and more
- **Portfolio Management**: Track and manage your domain collection

### 💬 **Secure Messaging**
- **XMTP Integration**: Decentralized, end-to-end encrypted messaging
- **Domain Context**: Messages include domain information and offer details
- **Spam Protection**: Built-in consent management for spam-free communication
- **Rich Content**: Support for offers, counter-offers, and structured messages

### 📊 **Analytics & Insights**
- **Performance Dashboard**: Track domain performance and market trends
- **Transaction History**: Complete record of all domain transactions
- **Market Analytics**: Real-time market data and pricing insights
- **Portfolio Analytics**: Comprehensive analysis of your domain holdings

### 🔄 **Real-Time Updates**
- **Live Events**: Instant notifications for new listings, offers, and transactions
- **WebSocket Integration**: Real-time data streaming for optimal user experience
- **Event Filtering**: Customizable event subscriptions for relevant updates

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with concurrent features and improved rendering
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Apollo Client** - GraphQL client for efficient data fetching and caching

### **Blockchain Integration**
- **Doma Protocol** - Multi-chain domain tokenization and trading
- **Ethers.js** - Ethereum blockchain interaction
- **Wagmi** - React hooks for Ethereum wallet integration
- **XMTP** - Decentralized messaging protocol

### **Real-Time Features**
- **GraphQL Subscriptions** - Real-time data updates
- **WebSocket Polling** - Event streaming from Doma Protocol
- **Apollo Cache** - Intelligent data caching and synchronization

### **Development Tools**
- **TypeScript** - Type-safe development
- **ESLint & Prettier** - Code quality and formatting
- **Jest & React Testing Library** - Comprehensive testing suite

## 📋 Prerequisites

- **Node.js** (v22.x or higher) - Required for Doma Protocol integration
- **npm** or **yarn** - Package manager
- **Web3 Wallet** - MetaMask, WalletConnect, or similar
- **Doma Protocol API Key** - Get from [Doma Protocol](https://docs.doma.xyz)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gr4yha7/namenest.git
   cd namenest
   ```

2. **Switch to Node.js v22:**
   ```bash
   nvm use lts/jod
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Doma Protocol Configuration
   VITE_DOMA_POLL_API_URL=https://api-testnet.doma.xyz/v1/poll
   VITE_DOMA_ORDERBOOK_API_URL=https://api-testnet.doma.xyz/orderbook
   VITE_DOMA_SUBGRAPH_URL=https://api-testnet.doma.xyz/subgraph
   VITE_DOMA_API_KEY=your_doma_api_key_here
   
   # XMTP Configuration
   VITE_XMTP_ENV=dev
   VITE_XMTP_PRIVATE_KEY=your_xmtp_private_key_here
   
   # Network Configuration
   VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
   VITE_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/your_infura_key
   VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔗 Doma Protocol Integration

NameNest is built on top of Doma Protocol, providing:

### **Multi-Chain Domain Trading**
- **Ethereum**: ENS domains with ETH payments
- **Polygon**: Low-cost domain trading with MATIC
- **Solana**: High-performance domain transactions

### **Real-Time Features**
- **Live Event Streaming**: Instant updates for new listings, offers, and transactions
- **WebSocket Integration**: Real-time data synchronization
- **Event Filtering**: Customizable event subscriptions

### **Secure Messaging**
- **XMTP Protocol**: Decentralized, end-to-end encrypted messaging
- **Domain Context**: Messages include domain and offer information
- **Spam Protection**: Built-in consent management

### **Advanced Analytics**
- **Market Data**: Real-time pricing and trend analysis
- **Portfolio Tracking**: Comprehensive domain portfolio management
- **Transaction History**: Complete audit trail of all activities

## 📁 Project Structure

```
namenest/
├── public/                    # Static assets and images
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, etc.)
│   │   ├── AppIcon.jsx       # Application icon component
│   │   ├── AppImage.jsx      # Image handling component
│   │   ├── ErrorBoundary.jsx # Error boundary wrapper
│   │   └── ScrollToTop.jsx   # Scroll management
│   ├── pages/                # Page components
│   │   ├── domain-marketplace-browse/     # Domain marketplace
│   │   ├── domain-portfolio-dashboard/    # Portfolio management
│   │   ├── domain-detail-negotiation/     # Domain negotiation
│   │   ├── domain-listing-creation/       # Create domain listings
│   │   ├── real-time-messaging-center/    # XMTP messaging
│   │   ├── transaction-order-management/  # Order management
│   │   ├── web3-wallet-integration-hub/   # Wallet integration
│   │   ├── decentralized-domain-registry/ # Domain registry
│   │   └── analytics-performance-dashboard/ # Analytics
│   ├── services/             # Service layer
│   │   └── doma/            # Doma Protocol integration
│   │       ├── config.js           # Configuration management
│   │       ├── pollService.js      # Real-time event polling
│   │       ├── orderbookService.js # Order management
│   │       ├── subgraphService.js  # GraphQL queries
│   │       ├── xmtpService.js      # XMTP messaging
│   │       ├── index.js           # Service exports
│   │       └── README.md          # Service documentation
│   ├── hooks/               # Custom React hooks
│   │   └── useDoma.js       # Doma Protocol hooks
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles and Tailwind config
│   ├── examples/            # Integration examples
│   ├── App.jsx              # Main application component
│   ├── Routes.jsx           # Application routing
│   └── index.jsx            # Application entry point
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.mjs          # Vite configuration
└── README.md                # Project documentation
```

## 📱 Application Pages

### **🏪 Domain Marketplace Browse**
- Browse available domain listings across all supported networks
- Advanced filtering by TLD, price range, network, and availability
- Real-time search with autocomplete suggestions
- Domain preview with detailed information

### **💼 Portfolio Dashboard**
- Manage your domain collection and listings
- Track domain performance and market value
- Bulk management tools for multiple domains
- Analytics and insights for your portfolio

### **🤝 Domain Detail & Negotiation**
- Detailed domain information and history
- Secure messaging with domain context
- Offer management and counter-offers
- Transaction history and activity tracking

### **📝 Listing Creation**
- Create new domain listings with step-by-step wizard
- Domain verification and validation
- Pricing configuration and marketplace settings
- SEO optimization and metadata management

### **💬 Real-Time Messaging Center**
- XMTP-powered secure messaging
- Domain-contextual conversations
- Offer and negotiation management
- Message search and filtering

### **📊 Analytics & Performance Dashboard**
- Market trends and domain performance metrics
- Comparative analysis tools
- Transaction history and reporting
- Custom analytics and insights

### **🔗 Web3 Wallet Integration Hub**
- Multi-wallet support (MetaMask, WalletConnect, etc.)
- Cross-chain balance management
- Transaction history and status tracking
- Smart contract interaction management

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import DomainMarketplace from "pages/domain-marketplace-browse";
import PortfolioDashboard from "pages/domain-portfolio-dashboard";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <DomainMarketplace /> },
    { path: "/portfolio", element: <PortfolioDashboard /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```
