import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function ChatScrollArea({ children }: Props) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-4 pt-4">
      {children}
    </div>
  );
}

export default ChatScrollArea;
