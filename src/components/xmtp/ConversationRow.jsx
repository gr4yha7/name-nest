import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { shortenAddress } from "utils/cn";
import { useNavigate } from "react-router";
import { useGlobal } from "context/global";
import { useSearchParams } from "react-router-dom";

/**
 * ConversationRow
 * One row in conversations list, shows peer and last message snippet.
 */
const ConversationRow = ({ dm }) => {
  const navigate = useNavigate();
  const { xmtpClient } = useGlobal();
  const [searchParams] = useSearchParams();
  const [peerAddress, setPeerAddress] = useState("Unknown");
  const [lastTime, setLastTime] = useState("");
  const [snippet, setSnippet] = useState("---");
  const [loading, setLoading] = useState(false);

  const activeId = searchParams.get('dm');


  const applySnippet = useCallback(
    (message) => {
      if (!message || typeof message.content !== "string") return;
      const type = message.content.split("::")[0];
      const fromMe = message.senderInboxId === xmtpClient?.inboxId;
      setLastTime(new Date(Number(message?.sentAtNs) / 1_000_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      if (fromMe) {
        if (type === "send_offer") setSnippet("💌 Sent an offer");
        else if (type === "accept_offer") setSnippet("🎉 Accepted an offer");
        else if (type === "offer_domain") setSnippet("🌐 Sent a domain listing");
        else if (type === "offer_domain_accept") setSnippet("🎉 Accepted your domain listing");
        else setSnippet(String(message.content));
      } else {
        if (type === "send_offer") setSnippet("💌 Received an offer");
        else if (type === "accept_offer") setSnippet("🎉 Accepted your offer");
        else if (type === "offer_domain") setSnippet("🌐 Received a domain listing");
        else if (type === "offer_domain_accept") setSnippet("🎉 Accepted your domain listing");
        else setSnippet(String(message.content));
      }
    },
    [xmtpClient?.inboxId]
  );

  // Stream messages to keep snippet fresh
  useEffect(() => {
    if (!dm) return;
    let stream;
    (async () => {
      stream = await dm.stream({
        onValue: (m) => applySnippet(m),
        onError: (e) => console.error("dm stream error", e),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [dm, applySnippet]);

  // Initial snippet + peer address
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const history = await dm.messages();
        const last = [...history].reverse().find((m) => typeof m.content === "string");
        if (!cancelled && last) applySnippet(last);

        const inboxId = await dm.peerInboxId();
        const states = await xmtpClient?.preferences.inboxStateFromInboxIds([inboxId]);
        if (!cancelled) {
          setPeerAddress(states?.[0]?.identifiers?.[0]?.identifier || "Unknown");
        }
      } catch {
        if (!cancelled) setPeerAddress("Unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dm, xmtpClient?.preferences, applySnippet]);

  const goThread = useCallback(() => {
    navigate(`?dm=${dm.id}&recipient=${peerAddress}`);
  }, [dm.id, navigate, peerAddress]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (

    <div onClick={goThread} className={`p-4 cursor-pointer flex items-start space-x-3 transition-standard hover:bg-muted ${activeId === dm.id ? 'bg-muted border-r-2 border-primary' : ''}`}>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-foreground truncate">
            {shortenAddress(peerAddress)}
          </h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {lastTime}
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium text-success`}>
            active
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {snippet}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationRow;


