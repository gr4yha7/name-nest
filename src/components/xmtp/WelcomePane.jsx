import { CheckCircle, MessageCircle, Shield } from "lucide-react";

const WelcomePane = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <Shield className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Secure Messaging via XMTP
          </h2>
          <p className="text-muted-foreground">Select a chat to start messaging.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm bg-background/50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-background/50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Decentralized & private</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-background/50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Your keys, your data</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs pt-4 text-muted-foreground">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span>Powered by XMTP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePane;


