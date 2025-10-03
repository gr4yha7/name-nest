import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "utils/cn";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "context/global";
import { useMessagingContext } from "./MessagingContext";
import MessageComposer from "./MessageComposer";
import WelcomePane from "./WelcomePane";

/**
 * ThreadView
 * Right-hand side: messages of selected conversation + composer.
 */
const ThreadView = () => {
  const [searchParams] = useSearchParams();
  const { xmtpClient } = useGlobal();
  const { isThreadOpen, setIsThreadOpen, syncing, setSyncing } = useMessagingContext();
  const { address } = useAccount();

  const [dm, setDm] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const isVisible = useMemo(() => {
    return Boolean(searchParams.get("dm") && searchParams.get("sender") && xmtpClient);
  }, [searchParams, xmtpClient]);

  const amISender = useCallback(
    (peerInboxId) => xmtpClient?.inboxId === peerInboxId,
    [xmtpClient?.inboxId]
  );

  const grouped = useMemo(() => {
    return messages.reduce((acc, m) => {
      const day = new Date(Number(m.sentAtNs) / 1_000_000).toISOString().split("T")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        id: m.id,
        content: m.content,
        sender: amISender(m.senderInboxId) ? address || "Unknown" : searchParams.get("sender") || "Unknown",
        timestamp: new Date(Number(m.sentAtNs) / 1_000_000),
      });
      return acc;
    }, {});
  }, [messages, amISender, address, searchParams]);

  // Sync button state
  useEffect(() => {
    if (dm && syncing) {
      dm.sync().catch(() => toast.error("Failed to sync messages")).finally(() => setSyncing(false));
    }
  }, [dm, syncing, setSyncing]);

  // Stream messages
  useEffect(() => {
    if (!dm) return;
    let stream;
    (async () => {
      stream = await dm.stream({
        onValue: (m) => {
          if (m && typeof m.content === "string") setMessages((p) => [...p, m]);
        },
        onError: (e) => console.error("message stream error", e),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [dm]);

  // Load chosen thread
  useEffect(() => {
    if (searchParams.get("dm") && searchParams.get("sender") && xmtpClient) {
      setSyncing(false);
      setIsThreadOpen(true);
      (async () => {
        const conversation = await xmtpClient.conversations.getConversationById(searchParams.get("dm") || "");
        setDm(conversation);
        const list = await conversation?.messages();
        const onlyText = list?.filter((m) => typeof m.content === "string");
        setMessages(onlyText || []);
      })();
    } else {
      setDm(null);
      setMessages([]);
      setIsThreadOpen(false);
    }
  }, [searchParams, xmtpClient, setIsThreadOpen, setSyncing]);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    (text) => {
      if (!dm || text.trim() === "") return;
      setSending(true);
      dm.send(text.trim()).catch(() => toast.error("Failed to send message"))
        .finally(() => setSending(false));
    },
    [dm]
  );

  return (
    <div className={cn("relative flex-1 border p-4 rounded-xl bg-white dark:bg-background transition-all w-full min-w-full md:min-w-[calc(100%_-_420px)] max-h-[calc(100%_-_var(--spacing)*2)] max-w-[calc(100%_-_400px)]", isThreadOpen ? "block" : "hidden md:block")}
    >
      {syncing && (
        <div className="absolute top-0 left-0 w-full h-full bg-background/50 z-10 pointer-events-none transition-opacity backdrop-blur-xs">
          <div className="flex items-center justify-center h-full gap-2">
            <Loader size={16} className="animate-spin" />
            <div className="text-sm">Syncing Messages...</div>
          </div>
        </div>
      )}
      {isVisible ? (
        <div className="flex flex-col h-[calc(100%_-_48px)] mt-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(grouped).map(([date, msgs]) => (
              <div key={date} className="space-y-2">
                <div className="text-center text-sm text-muted-foreground">
                  {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </div>
                {msgs.map((msg) => (
                  <div key={msg.id} className="flex flex-col space-y-1">
                    <div className={`flex ${msg.sender === address ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-lg px-3 py-2 ${msg.sender === address ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-4">
            <MessageComposer onSend={send} busy={sending} />
          </div>
        </div>
      ) : (
        <WelcomePane />)
      }
    </div>
  );
};

export default ThreadView;


