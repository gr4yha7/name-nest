import React from "react";
import Routes from "./Routes";
import WagmiProviderWrapper from "./providers/WagmiProvider";

function App() {
  return (
    <WagmiProviderWrapper>
      <Routes />
    </WagmiProviderWrapper>
  );
}

export default App;
