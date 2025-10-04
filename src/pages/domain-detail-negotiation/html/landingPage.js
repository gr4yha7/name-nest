const seoTags = `
    <!-- SEO Meta Tags -->
    <meta name="description" content="Own a premium domain on the Doma Testnet blockchain. Memorable, brandable, and built on decentralized technology. Listed for a price or best offer.">
    <meta name="keywords" content="Domain, Web3 domain, ENS domain, Doma Protocol domain, blockchain domain, premium domain, NFT domain, decentralized web">
    <meta name="author" content="NameNest">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://name-nest-lemon.vercel.app/crypto.eth">
    
    <!-- Open Graph Meta Tags (Facebook, LinkedIn) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="NameNest Domain">
    <meta property="og:description" content="Own a premium domain on the Doma Testnet blockchain. Memorable, brandable, and built on decentralized technology. Listed for a price or best offer.">
    <meta property="og:image" content="https://name-nest-lemon.vercel.app/og-image.jpg">
    <meta property="og:url" content="https://name-nest-lemon.vercel.app/crypto.eth">
    <meta property="og:site_name" content="NameNest">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="NameNest Domain">
    <meta name="twitter:description" content="Own a premium domain on the Doma Testnet blockchain. Memorable, brandable, and built on decentralized technology. Listed for a price or best offer.">
    <meta name="twitter:image" content="https://name-nest-lemon.vercel.app/twitter-card.jpg">
    <meta name="twitter:creator" content="@namenest_">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "NameNest",
      "description": "Own a premium domain on the Doma Testnet blockchain. Memorable, brandable, and built on decentralized technology. Listed for a price or best offer.",
      "brand": {
        "@type": "Brand",
        "name": "NameNest"
      },
      "category": "Domain, Web3 Domain",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "3"
      }
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "NameNest",
      "url": "https://name-nest-lemon.vercel.app",
      "logo": "https://name-nest-lemon.vercel.app/logo.png",
      "description": "Own a premium domain on the Doma Testnet blockchain. Memorable, brandable, and built on decentralized technology. Listed for a price or best offer.",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Sales",
        "email": "contact@name-nest-lemon.vercel.app"
      }
    }
    </script>
`

export const DOCUMENT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${seoTags}
    <title>NameNest - Own Your Digital Identity</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #3b82f6;
            --primary-hover: #2563eb;
            --dark: #0a0a0a;
            --dark-card: #141414;
            --dark-border: #262626;
            --gray-dark: #525252;
            --gray: #737373;
            --gray-light: #a3a3a3;
            --white: #fafafa;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--dark);
            color: var(--white);
            overflow-x: hidden;
            line-height: 1.6;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
            background: var(--dark);
            border-bottom: 1px solid var(--dark-border);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--white);
            letter-spacing: -0.5px;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--gray-light);
            text-decoration: none;
            transition: color 0.3s;
            font-size: 0.95rem;
        }

        .nav-links a:hover {
            color: var(--white);
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem 5%;
            position: relative;
        }

        .hero-content {
            max-width: 900px;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .domain-badge {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid var(--primary);
            border-radius: 50px;
            margin-bottom: 2rem;
            font-size: 0.9rem;
            color: var(--white);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        h1 {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            color: var(--white);
            line-height: 1.1;
            font-weight: 600;
            letter-spacing: -2px;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--gray);
            margin-bottom: 3rem;
            line-height: 1.7;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .price-tag {
            font-size: 2rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }

        .price-amount {
            color: var(--primary);
        }

        .price-label {
            font-size: 1rem;
            color: var(--gray);
            font-weight: 400;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 1rem 2.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            font-weight: 500;
        }

        .btn-primary {
            background: var(--primary);
            color: var(--white);
        }

        .btn-primary:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: var(--dark-card);
            color: var(--white);
            border: 1px solid var(--dark-border);
        }

        .btn-secondary:hover {
            border-color: var(--gray-dark);
        }

        section {
            padding: 6rem 5%;
            position: relative;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-header h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
            letter-spacing: -1px;
        }

        .section-header p {
            color: var(--gray);
            font-size: 1.1rem;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .feature-card {
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 12px;
            padding: 2.5rem;
            transition: all 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--gray-dark);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
        }

        .feature-card h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .feature-card p {
            color: var(--gray);
            line-height: 1.7;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .stat-card {
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 12px;
            padding: 2.5rem;
            text-align: center;
        }

        .stat-number {
            font-size: 3.5rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 0.5rem;
            letter-spacing: -1px;
        }

        .stat-label {
            color: var(--gray);
            font-size: 1.1rem;
        }

        .testimonials {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .testimonial-card {
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 12px;
            padding: 2.5rem;
        }

        .testimonial-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--white);
        }

        .testimonial-info h4 {
            margin-bottom: 0.3rem;
            font-weight: 600;
        }

        .testimonial-info p {
            color: var(--gray);
            font-size: 0.9rem;
        }

        .testimonial-text {
            color: var(--gray-light);
            line-height: 1.7;
        }

        .rating {
            color: var(--primary);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .gallery-item {
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s;
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            padding: 1.5rem;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            border-color: var(--gray-dark);
        }

        .mockup-browser {
            background: var(--dark);
            border: 1px solid var(--dark-border);
            border-radius: 8px;
            overflow: hidden;
        }

        .browser-header {
            background: var(--dark-card);
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-bottom: 1px solid var(--dark-border);
        }

        .browser-dots {
            display: flex;
            gap: 0.4rem;
        }

        .browser-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--gray-dark);
        }

        .browser-url {
            flex: 1;
            background: var(--dark);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
            color: var(--gray);
            margin-left: 1rem;
        }

        .mockup-content {
            padding: 2rem;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .mockup-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--white);
            margin-bottom: 0.5rem;
        }

        .mockup-subtitle {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 1rem;
        }

        .mockup-element {
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .mockup-icon {
            width: 40px;
            height: 40px;
            background: var(--primary);
            border-radius: 6px;
            flex-shrink: 0;
        }

        .mockup-text {
            flex: 1;
        }

        .mockup-line {
            height: 8px;
            background: var(--dark-border);
            border-radius: 4px;
            margin-bottom: 0.5rem;
        }

        .mockup-line.short {
            width: 60%;
        }

        .mockup-stats {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .mockup-stat {
            flex: 1;
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
            padding: 0.75rem;
            text-align: center;
        }

        .mockup-stat-value {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--primary);
        }

        .mockup-stat-label {
            font-size: 0.75rem;
            color: var(--gray);
            margin-top: 0.25rem;
        }

        .mockup-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
        }

        .mockup-card {
            aspect-ratio: 1;
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
        }

        .mockup-chart {
            height: 100px;
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 6px;
            padding: 1rem;
            position: relative;
            overflow: hidden;
        }

        .chart-bars {
            display: flex;
            align-items: flex-end;
            gap: 0.5rem;
            height: 100%;
        }

        .chart-bar {
            flex: 1;
            background: var(--primary);
            border-radius: 4px 4px 0 0;
            opacity: 0.7;
        }

        .chart-bar:nth-child(1) { height: 40%; }
        .chart-bar:nth-child(2) { height: 70%; }
        .chart-bar:nth-child(3) { height: 85%; }
        .chart-bar:nth-child(4) { height: 60%; }
        .chart-bar:nth-child(5) { height: 95%; }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            background: var(--dark-card);
            border: 1px solid var(--dark-border);
            border-radius: 12px;
            padding: 3rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--gray-light);
            font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: var(--dark);
            border: 1px solid var(--dark-border);
            border-radius: 8px;
            color: var(--white);
            font-size: 1rem;
            transition: border-color 0.3s;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 150px;
        }

        footer {
            text-align: center;
            padding: 3rem 5%;
            border-top: 1px solid var(--dark-border);
            color: var(--gray);
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 3rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .section-header h2 {
                font-size: 2rem;
            }

            nav {
                padding: 1rem 5%;
            }

            .nav-links {
                display: none;
            }

            section {
                padding: 4rem 5%;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="logo">NameNest</div>
        <ul class="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#stats">Statistics</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section class="hero">
        <div class="hero-content">
            <div class="domain-badge">
            🚀 Premium Domain Available - <data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.chain", "defaultValue": "Doma Testnet"}'></data-variable>
            </div>
            <h1>
              <data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>
            </h1>
            <p>Own a piece of the decentralized web. This premium domain is your gateway to building the future of the internet—memorable, brandable, and built on blockchain technology.</p>
            <div class="price-tag">
                <span class="price-amount">
                <data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.price", "defaultValue": "0.1 ETH"}'></data-variable>
                </span>
                <span class="price-label">or best offer</span>
            </div>
            <div class="cta-buttons">
                <button class="btn btn-primary" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">Make an Offer</button>
                <button class="btn btn-secondary" onclick="document.getElementById('features').scrollIntoView({behavior: 'smooth'})">Learn More</button>
            </div>
        </div>
    </section>

    <section id="stats">
        <div class="section-header">
            <h2>Domain Performance</h2>
            <p>Real metrics that demonstrate the value of this premium domain asset</p>
        </div>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">50K+</div>
                <div class="stat-label">Monthly Visitors</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">95</div>
                <div class="stat-label">Domain Authority</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">1.2M</div>
                <div class="stat-label">Brand Searches</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$500K+</div>
                <div class="stat-label">Estimated Value</div>
            </div>
        </div>
    </section>

    <section id="features">
        <div class="section-header">
            <h2>Why This Domain?</h2>
            <p>Unmatched benefits for the WWW era</p>
        </div>
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Instant Recognition</h3>
                <p>A short, memorable domain that instantly conveys your web presence and builds trust with your audience in the decentralized ecosystem.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>Blockchain Secured</h3>
                <p>Full ownership on the Ethereum blockchain with immutable records. Your domain, your rules—no centralized authority can take it away.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💎</div>
                <h3>Appreciating Asset</h3>
                <p>Premium domains have shown consistent value appreciation. This is not just a domain—it's a strategic investment in digital real estate.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌐</div>
                <h3>Multi-Use Potential</h3>
                <p>Use it for DeFi platforms, NFT marketplaces, crypto exchanges, Web3 gaming, or as a wallet address. The possibilities are limitless.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📈</div>
                <h3>SEO Optimized</h3>
                <p>Strong domain authority and established backlink profile ensure your website/web app project ranks high in search results from day one.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Brand Authority</h3>
                <p>Establish immediate credibility in the crypto space with a domain that resonates with your target audience and industry leaders.</p>
            </div>
        </div>
    </section>

    <section id="gallery">
        <div class="section-header">
            <h2>Visual Showcase</h2>
            <p>Envision the potential of your domain</p>
        </div>
        <div class="gallery">
            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url">
                        <data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/defi</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">DeFi Platform</div>
                        <div class="mockup-subtitle">Decentralized Finance Hub</div>
                        <div class="mockup-stats">
                            <div class="mockup-stat">
                                <div class="mockup-stat-value">$2.4M</div>
                                <div class="mockup-stat-label">TVL</div>
                            </div>
                            <div class="mockup-stat">
                                <div class="mockup-stat-value">12.5%</div>
                                <div class="mockup-stat-label">APY</div>
                            </div>
                            <div class="mockup-stat">
                                <div class="mockup-stat-value">8.2K</div>
                                <div class="mockup-stat-label">Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url"><data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/marketplace</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">NFT Marketplace</div>
                        <div class="mockup-subtitle">Digital Collectibles Exchange</div>
                        <div class="mockup-grid">
                            <div class="mockup-card"></div>
                            <div class="mockup-card"></div>
                            <div class="mockup-card"></div>
                            <div class="mockup-card"></div>
                            <div class="mockup-card"></div>
                            <div class="mockup-card"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url"><data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/exchange</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">Crypto Exchange</div>
                        <div class="mockup-subtitle">Trade Digital Assets</div>
                        <div class="mockup-chart">
                            <div class="chart-bars">
                                <div class="chart-bar"></div>
                                <div class="chart-bar"></div>
                                <div class="chart-bar"></div>
                                <div class="chart-bar"></div>
                                <div class="chart-bar"></div>
                            </div>
                        </div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url"><data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/gaming</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">Web3 Gaming</div>
                        <div class="mockup-subtitle">Play-to-Earn Platform</div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url"><data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/dao</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">DAO Platform</div>
                        <div class="mockup-subtitle">Decentralized Governance</div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                        <div class="mockup-stats">
                            <div class="mockup-stat">
                                <div class="mockup-stat-value">24</div>
                                <div class="mockup-stat-label">Proposals</div>
                            </div>
                            <div class="mockup-stat">
                                <div class="mockup-stat-value">1.8K</div>
                                <div class="mockup-stat-label">Members</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-item">
                <div class="mockup-browser">
                    <div class="browser-header">
                        <div class="browser-dots">
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                            <div class="browser-dot"></div>
                        </div>
                        <div class="browser-url"><data-variable data-gjs-data-resolver='{"path": "globalData.domain.data.name", "defaultValue": "legionize.io"}'></data-variable>/wallet</div>
                    </div>
                    <div class="mockup-content">
                        <div class="mockup-title">Wallet Service</div>
                        <div class="mockup-subtitle">Secure Digital Assets</div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                        <div class="mockup-element">
                            <div class="mockup-icon"></div>
                            <div class="mockup-text">
                                <div class="mockup-line short"></div>
                                <div class="mockup-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="testimonials">
        <div class="section-header">
            <h2>What Industry Leaders Say</h2>
            <p>Trusted by pioneers in the Web3 space</p>
        </div>
        <div class="testimonials">
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="avatar">SM</div>
                    <div class="testimonial-info">
                        <h4>Sarah Mitchell</h4>
                        <p>CEO, DeFi Innovations</p>
                    </div>
                </div>
                <div class="rating">★★★★★</div>
                <p class="testimonial-text">"Acquiring a premium Web3 domain was the best investment we made. The instant brand recognition and trust it brings to our platform is invaluable. Our user acquisition costs dropped by 40%."</p>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="avatar">JC</div>
                    <div class="testimonial-info">
                        <h4>James Chen</h4>
                        <p>Founder, NFT Gallery</p>
                    </div>
                </div>
                <div class="rating">★★★★★</div>
                <p class="testimonial-text">"The SEO value alone justified the investment. We rank on the first page for competitive keywords without extensive marketing. A premium domain is a must-have for serious web projects."</p>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="avatar">ER</div>
                    <div class="testimonial-info">
                        <h4>Emma Rodriguez</h4>
                        <p>CMO, Crypto Ventures</p>
                    </div>
                </div>
                <div class="rating">★★★★★</div>
                <p class="testimonial-text">"Our domain has appreciated 300% in value over two years. It's not just infrastructure—it's a strategic asset that grows with our business and the entire crypto ecosystem."</p>
            </div>
        </div>
    </section>

    <section id="contact">
        <div class="section-header">
            <h2>Make Your Offer</h2>
            <p>Let's discuss how this domain can transform your vision</p>
        </div>
        <form class="contact-form" onsubmit="handleSubmit(event)">
            <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="company">Company / Project</label>
                <input type="text" id="company">
            </div>
            <div class="form-group">
                <label for="offer">Your Offer / Message *</label>
                <textarea id="offer" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Offer</button>
        </form>
    </section>

    <footer>
        <p>&copy; 2025 NameNest. All rights reserved. | Powered by Doma Protocol</p>
    </footer>

    <script>
        function handleSubmit(e) {
            e.preventDefault();
            alert('Thank you for your interest! We will review your offer and get back to you within 24 hours.');
            e.target.reset();
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .stat-card, .testimonial-card, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    </script>
</body>
</html>`