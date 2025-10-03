import React from "react";
import Routes from "./Routes";
import useXMTP from "hooks/useXMTP";
import ConnectXMTPLoader from "components/xmtp/ConnectXMTPLoader";

function App() {
  const { isLoading: isConnectingXmtp } = useXMTP()
  return (
    <>
      {isConnectingXmtp && <ConnectXMTPLoader/>}
      <Routes />
    </>
  );
}

export default App;
