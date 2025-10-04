import React, { useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DomainListingCreation from './pages/domain-listing-creation';
import TransactionOrderManagement from './pages/transaction-order-management';
import DomainDetailNegotiation from './pages/domain-detail-negotiation';
import DomainMarketplaceBrowse from './pages/domain-marketplace-browse';
import AnalyticsPerformanceDashboard from './pages/analytics-performance-dashboard';
import DomainPortfolioDashboard from './pages/domain-portfolio-dashboard';
import Web3WalletIntegrationHub from './pages/web3-wallet-integration-hub';
import DecentralizedDomainRegistry from './pages/decentralized-domain-registry';
import DomainOffers from "pages/domain-offers";
import XMTPMessaging from './pages/xmtp-messaging';
import DomainSalesPage from './pages/domain-sales';
import AccountSettings from "pages/account-settings";
import { useGlobal } from "context/global";

const MessageRoute = () => {
  const { xmtpClient, setXmtpClient } = useGlobal();

  // Close XMTP client when the component unmounts (user leaves the message route)
  useEffect(() => {
    return () => {
      if (xmtpClient) {
        xmtpClient.close();
        setXmtpClient(null); // Optionally clear the client from global state
      }
    };
  }, [xmtpClient, setXmtpClient]);

  return (
    <XMTPMessaging />
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DomainMarketplaceBrowse />} />
        <Route path="/domain-listing-creation" element={<DomainListingCreation />} />
        <Route path="/transaction-order-management" element={<TransactionOrderManagement />} />
        <Route path="/domain-detail-negotiation" element={<DomainDetailNegotiation />} />
        <Route path="/domain-offers" element={<DomainOffers />} />
        <Route path="/account-setting" element={<AccountSettings />} />
        <Route path="/domain-marketplace-browse" element={<DomainMarketplaceBrowse />} />
        <Route path="/analytics-performance-dashboard" element={<AnalyticsPerformanceDashboard />} />
        <Route path="/domain-portfolio-dashboard" element={<DomainPortfolioDashboard />} />
        <Route path="/web3-wallet-integration-hub" element={<Web3WalletIntegrationHub />} />
        <Route path="/decentralized-domain-registry" element={<DecentralizedDomainRegistry />} />
        <Route path="/messages" element={<MessageRoute />} />
        <Route path="/domain/:name" element={<DomainSalesPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;