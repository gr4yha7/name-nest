import React from 'react';
import ThreadView from './ThreadView';

// Thin wrapper so we can swap into RTMC layout without changing ThreadView
const RtmcChat = ({ isMobile = false, onBack }) => {
  return (
    <div className={`flex-1 ${isMobile ? 'w-full' : ''}`}>
      {/* Back button space kept for parity; action is handled by RTMC when mobile */}
      <ThreadView />
    </div>
  );
};

export default RtmcChat;


