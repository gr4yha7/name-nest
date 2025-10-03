import Button from "../ui/Button";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";

const MessageComposer = ({ onSend, busy }) => {
  const [text, setText] = useState("");

  const fire = useCallback(() => {
    onSend(text);
    setText("");
  }, [text, onSend]);

  const onKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        fire();
      }
    },
    [fire]
  );

  return (
    <div className="relative flex items-center">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="Type your message... (Shift+Enter for new line)"
        className="w-full min-h-[40px] max-h-[120px] resize-none rounded-md border border-input bg-accent/50 px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        rows={2}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button size="sm" className="h-8 w-8 p-0" disabled={busy} onClick={fire}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;


