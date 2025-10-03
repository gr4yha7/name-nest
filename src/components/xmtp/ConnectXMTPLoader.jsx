// import React from "react";

// const FullModal = ({ isOpen, message }) => {
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="h-screen flex items-center justify-center">
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="flex flex-col items-center text-center">
//             {/* Spinner */}
//             <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mb-4"></div>
//             {/* Text */}
//             <p className="text-white text-md font-medium">
//               {message || 'Connecting to XMTP...'}
//             </p>
//             {/* Close Button */}
//             {/* <button
//               onClick={onClose}
//               className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
//             >
//               Close
//             </button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FullModal;

import { Loader } from "lucide-react";

const ConnectXMTPLoader = () => {
  return (
    <div className="absolute z-[10] top-0 left-0 w-full h-full bg-background/50 pointer-events-auto transition-opacity backdrop-blur-xs">
      <div className="flex items-center justify-center h-full gap-2">
        <Loader size={16} className="animate-spin" />
        <div className="text-sm">Connecting to XMTP...</div>
      </div>
    </div>
  );
};

export default ConnectXMTPLoader;

