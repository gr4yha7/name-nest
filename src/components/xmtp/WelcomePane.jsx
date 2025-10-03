import { CheckCircle, MessageCircle, Shield } from "lucide-react";

const WelcomePane = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 h-full bg-accent/10 rounded-xl">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Secure Messages via XMTP</h2>
          <p className="text-muted-foreground">Select a chat to start messaging.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Decentralized & private</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Your keys, your data</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs pt-4 text-muted-foreground">
            <MessageCircle className="w-3 h-3" />
            <span>Powered by XMTP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePane;


