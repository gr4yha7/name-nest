# NameNest
A comprehensive decentralized domain marketplace built with React, featuring real-time domain trading, domain landing pages preview, portfolio management, and secure messaging through (XMTP integration and through Doma Protocol integration).


## 🌟 Overview
NameNest is a next-generation domain marketplace that enables users to buy, sell, and trade tokenized domains across multiple blockchains. Built with modern web technologies and integrated with Doma Protocol, it provides a seamless experience for domain trading with real-time updates, secure messaging, and comprehensive portfolio management.


## 🚀 Key Features

### 🏷️ **Domain Marketplace**
- **Multi-Chain Support**: Trade domains on Doma, BaseSepolia,Sepolia, etc.
- **Real-Time Listings**: Live updates of domain availability and pricing
- **Advanced Search**: Filter by TLD, price range, network, names, offers received and more
- **Portfolio Management**: Track and manage your domain collection
- **Domains Activities**: View Domain details (offers, activities, listing history, etc)
- **Offers Management**: Offers Management (create offers, cancel offers, accept offer for a domain, direct domain purchase, etc)


### 💬 **Secure Messaging**
- **XMTP Integration**: Decentralized, end-to-end encrypted messaging
- **Domain Context**: Messages include domain information and offer details
- **Spam Protection**: Built-in consent management for spam-free communication
- **Rich Content**: Support for offers negotiation, counter-offers, and structured messages


### 💬 **Custom SEO-Optimized Landing Pages For Domain Owners**
- **GrapesJS Studio Integration**: Custom Domain Landing Page Editor (modifiable HTML content, UI components, styling, etc.)
- **SEO Optimization**: Includes meta tags, Open Graph tags, Twitter card tags, Structured JSON-LD Validated Data, Robots Meta, Canonical URL, etc.  
- **SEO Scoring**: Integrated Cheerio for SEO scoring and analytics.


### 📊 **Analytics & Insights**
- **Performance Dashboard**: Track domain performance and market trends
- **Transaction History**: Complete record of all domain transactions
- **Market Analytics**: Real-time market data and pricing insights
- **Portfolio Analytics**: Comprehensive analysis of your domain holdings


### 🔄 **Real-Time Updates**
- **Live Events**: Instant notifications for new listings, offers, and transactions
- **Event Filtering**: Customizable event subscriptions for relevant updates


## 🛠️ Technology Stack


### **Frontend**
- **React 18** - Modern React with concurrent features and improved rendering
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Apollo Client** - GraphQL client for efficient data fetching and caching


### **Tools Integration**
- **Doma Protocol** - Multi-chain domain tokenization and trading
- **Ethers.js** - Ethereum blockchain interaction
- **Wagmi** - React hooks for Ethereum wallet integration
- **XMTP** - Decentralized messaging protocol
- **GrapesJS Studio** - Custom Domain Landing Page Editor (SEO Optimized)
- **Cheerio** - SEO Score & Analytics generation


### **Real-Time Features**
- **GraphQL Queries** - Real-time data updates
- **Polling Events** - Event streaming from Doma Protocol


### **Development Tools**
- **Javascript** - Type-safe development


## 📋 Prerequisites


- **Node.js** (v22.x or higher) - Required for Doma Protocol integration
- **npm** or **yarn** - Package manager
- **Web3 Wallet** - MetaMask, WalletConnect, or similar
- **Wallet Connect Project ID** - Get from [Wallet ConnnectKit)
- **Doma Protocol API Key** - Get from [Doma Protocol](https://docs.doma.xyz)


## 🛠️ Installation


1. **Clone the repository:**
```bash
git clone https://github.com/gr4yha7/namenest.git
cd namenest
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
   
# Edit `.env` with your configuration:
# Doma Protocol Configuration
VITE_ENVIRONMENT=development
VITE_DOMA_POLL_INTERVAL=300000
VITE_DOMA_CACHE_TTL=300000
VITE_DOMA_BASE_API_URL=https://api-testnet.doma.xyz

VITE_DOMA_POLL_API_URL=https://api-testnet.doma.xyz/v1/poll
VITE_DOMA_ORDERBOOK_API_URL=https://api-testnet.doma.xyz/v1/orderbook
VITE_DOMA_SUBGRAPH_URL=https://api-testnet.doma.xyz/graphql
VITE_DOMA_API_KEY=your_doma_api_key_here

VITE_GRAPESJS_LICENSE_KEY==your_grapesjs_studio_license_key_here
```

4. **Start the development server:**
```bash
npm run start
```


## 🔗 Doma Protocol Integration
NameNest is built on top of Doma Protocol, providing:


### **Multi-Chain Domain Trading**
- **DomaTestnet, Base Sepolia, Sepolia, Curtis, etc**:  offers and direct purchase with WETH or USDC payments


### **Real-Time Features**
- **Live Event Streaming**: Instant updates for new listings, offers, and transactions
- **Event Filtering**: Customizable event polling


### **Secure Messaging**
- **XMTP Protocol**: Decentralized, end-to-end encrypted messaging
- **Domain Context**: Messages include domain and offer information


### **Advanced Analytics**
- **Market Data**: Real-time pricing and trend analysis
- **Portfolio Tracking**: Comprehensive domain portfolio management
- **Transaction History**: Complete audit trail of all activities
- **Domain Activities**: Complete audit trail of all token activities (listing, purchased, offers, etc)

## 📁 Project Structure

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
│   │   ├── domain-offers/     # Domain offers management
│   │   ├── domain-account-management/     # Account management (XMTP and general settings)
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


### **🤝 Domain Offers Management**
- Detailed domain offers from the connected account
- Offers management (displaying and cancelling of offers)


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

