import { useState, useContext } from "react";
import cx from "classnames";
import { MessageReactions as MessageReactionsType, Reaction, ToggleReaction } from "../../../../types";
import { UserContext } from "../../../../context/UserContext";

interface Props {
  messageId: string;
  reactions?: MessageReactionsType;
  toggleReaction: ToggleReaction;
  isUserMessage: boolean;
}

// Common emoji reactions
const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

function MessageReactions({ messageId, reactions = {}, toggleReaction, isUserMessage }: Props) {
  const { user } = useContext(UserContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Count total reactions
  const totalReactions = Object.values(reactions).reduce(
    (total, reactionList) => total + reactionList.length,
    0
  );

  // Check if current user has reacted with any emoji
  const hasUserReacted = user && Object.values(reactions).some(
    (reactionList) => reactionList.some((reaction) => reaction.userId === user.id)
  );

  const handleToggleReaction = (emoji: string) => {
    toggleReaction(messageId, emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {/* Display existing reactions */}
      {Object.entries(reactions).map(([emoji, reactionList]) => (
        <button
          key={emoji}
          onClick={() => handleToggleReaction(emoji)}
          className={cx(
            "flex items-center rounded-full border px-2 py-0.5 text-xs transition-colors",
            reactionList.some((r) => user && r.userId === user.id)
              ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          )}
        >
          <span className="mr-1">{emoji}</span>
          <span>{reactionList.length}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={cx(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors",
            showEmojiPicker
              ? "bg-gray-200 dark:bg-gray-700"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
            hasUserReacted && "text-blue-500 dark:text-blue-400"
          )}
          aria-label="Add reaction"
        >
          {showEmojiPicker ? "×" : "+"}
        </button>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className={cx(
            "absolute z-10 mt-1 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800",
            isUserMessage ? "right-0" : "left-0"
          )}>
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleToggleReaction(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageReactions;
