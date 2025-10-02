import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DomainListingCreation from './pages/domain-listing-creation';
import TransactionOrderManagement from './pages/transaction-order-management';
import DomainDetailNegotiation from './pages/domain-detail-negotiation';
import RealTimeMessagingCenter from './pages/real-time-messaging-center';
import DomainMarketplaceBrowse from './pages/domain-marketplace-browse';
import AnalyticsPerformanceDashboard from './pages/analytics-performance-dashboard';
import DomainPortfolioDashboard from './pages/domain-portfolio-dashboard';
import Web3WalletIntegrationHub from './pages/web3-wallet-integration-hub';
import DecentralizedDomainRegistry from './pages/decentralized-domain-registry';
import DomaIntegrationExample from './examples/DomaIntegrationExample';
import DomainOffers from "pages/domain-offers";
import XMTPMessagingTest from './pages/xmtp-messaging-test';
import DomainSalesPage from './pages/domain-sales';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsPerformanceDashboard />} />
        <Route path="/test" element={<DomaIntegrationExample />} />
        <Route path="/domain-listing-creation" element={<DomainListingCreation />} />
        <Route path="/transaction-order-management" element={<TransactionOrderManagement />} />
        <Route path="/domain-detail-negotiation" element={<DomainDetailNegotiation />} />
        <Route path="/domain-offers" element={<DomainOffers />} />
        <Route path="/real-time-messaging-center" element={<RealTimeMessagingCenter />} />
        <Route path="/domain-marketplace-browse" element={<DomainMarketplaceBrowse />} />
        <Route path="/analytics-performance-dashboard" element={<AnalyticsPerformanceDashboard />} />
        <Route path="/domain-portfolio-dashboard" element={<DomainPortfolioDashboard />} />
        <Route path="/web3-wallet-integration-hub" element={<Web3WalletIntegrationHub />} />
        <Route path="/decentralized-domain-registry" element={<DecentralizedDomainRegistry />} />
        <Route path="/xmtp-messaging-test" element={<XMTPMessagingTest />} />
        <Route path="/domain/:name" element={<DomainSalesPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;