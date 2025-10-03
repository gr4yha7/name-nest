import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { cn } from "utils/cn";
import ConversationRow from "./ConversationRow";
import { useGlobal } from "context/global";
import { useMessagingContext } from "./MessagingContext";

/**
 * ConversationsPanel
 * Left-hand list of active conversations. Streams new ones in real time.
 */
const ConversationsPanel = () => {
  const { xmtpClient } = useGlobal();
  const { isThreadOpen } = useMessagingContext();

  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);

  // Initial load of conversations
  useEffect(() => {
    if (!xmtpClient) {
      setThreads([]);
      return;
    }
    let cancelled = false;
    setLoadingThreads(true);
    (async () => {
      try {
        const list = await xmtpClient.conversations.list();
        const activeOnly = (list || []).filter((c) => c.isActive);
        if (!cancelled) setThreads(activeOnly);
      } catch (err) {
        console.error("Failed to load conversations", err);
        if (!cancelled) setThreads([]);
      } finally {
        if (!cancelled) setLoadingThreads(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [xmtpClient]);

  // Stream new conversations
  useEffect(() => {
    if (!xmtpClient) return;
    let stream;
    (async () => {
      stream = await xmtpClient.conversations.stream({
        onValue: (dm) => setThreads((prev) => prev.find((t) => t.id === dm.id) ? prev : [...prev, dm]),
        onError: (err) => console.error("conversation stream error", err),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [xmtpClient]);

  const hasThreads = useMemo(() => threads.length > 0, [threads.length]);

  return (
    <div
      className={cn(
        "flex flex-col flex-none border rounded-xl bg-white dark:bg-background transition-all w-full md:w-[400px] h-full max-h-[calc(100%_-_var(--spacing)*2)]",
        isThreadOpen ? "hidden md:block" : "block"
      )}
    >
      <div className="font-semibold text-2xl p-4">Chats</div>
      <div className="flex-1 overflow-y-auto">
        {loadingThreads ? (
          <div className="flex items-center gap-2 p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading chats...</span>
          </div>
        ) : !hasThreads ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[calc(100vh_-_240px)]">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No chats yet</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Start a conversation to see your chats appear here.
            </p>
          </div>
        ) : (
          threads.map((dm) => <ConversationRow key={dm.id} dm={dm} />)
        )}
      </div>
    </div>
  );
};

export default ConversationsPanel;


