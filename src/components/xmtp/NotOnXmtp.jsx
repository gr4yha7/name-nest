import { Shield, UserPlus } from "lucide-react";

const NotOnXmtp = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-200">Recipient Not Registered on XMTP</h2>
          <p className="text-orange-700 dark:text-orange-300">This user doesn't have an XMTP inbox yet. They need to sign up before you can start a conversation.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <Shield className="w-3 h-3" />
            <span>XMTP Registration Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotOnXmtp;


