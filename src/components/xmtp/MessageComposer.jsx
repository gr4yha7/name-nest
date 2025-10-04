import Icon from "components/AppIcon";
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
    <div className="p-4 border-t border-border bg-card">
        <form onSubmit={fire} className="flex items-end space-x-2">
          <div className="flex w-full items-center">
            
            <textarea
              value={text}
              onChange={(e) => setText(e?.target?.value)}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="w-full px-3 py-2 border  border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e?.key === 'Enter' && !e?.shiftKey) {
                  e?.preventDefault();
                  fire(e);
                }
              }}
            />
          </div>
          
          <Button type="submit"  disabled={busy} onClick={fire}>
            <Icon name="Send" size={16} />
          </Button>
        </form>
      </div>
  );
};

export default MessageComposer;


