import cx from "classnames";
import { User as AppUser, MessageReactions as MessageReactionsType, ToggleReaction } from "../../../../types";
import { useState, useEffect } from "react";
import MessageReactions from "./MessageReactions";

interface Props {
  user: AppUser | null;
  message: {
    id: string;
    text: string;
    timestamp: string;
    status: string;
    reactions?: MessageReactionsType;
  };
  __userIsMe?: boolean;
  __isActive?: boolean;
  setActiveMessage: (messageId: string) => void;
  toggleReaction: ToggleReaction;
}

function ChatBubble(props: Props) {
  const [containerClass, setContainerClass] = useState<string>("")

  useEffect(() => {
    setTimeout(() => setContainerClass("opacity-100"), 1000)
  }, [])

  const { user, message, __userIsMe, __isActive, setActiveMessage, toggleReaction } = props;
  if (!user || !message) return null;

  const { id: userId, name, avatar } = user;
  const { src: avatarSrc } = avatar;

  const { id: messageId, text, timestamp, reactions } = message;

  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const classNames = {
    container: () => {
      if (__userIsMe) return "items-end";
      return "items-start";
    },
    bubble: () => {
      if (__userIsMe)
        return "border-gray-200 bg-blue-500 dark:bg-blue-700 ml-auto hover:bg-blue-600 dark:hover:bg-blue-800";
      return "border-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600";
    },
    bubbleIsActive: () => {
      if (__isActive && __userIsMe) return "bg-blue-600 dark:bg-blue-800";
      if (__isActive) return "bg-gray-200 dark:bg-gray-600";
      return "";
    },
    meText: () => {
      if (__userIsMe) return "text-white";
      return "";
    },
    meTime: () => {
      if (__userIsMe) return "ml-auto";
      return "";
    },
    time: () => {
      if (__isActive) return "opacity-1 mt-1 mb-4";
      return "opacity-0 mt-1";
    },
  };

  return (
    <div className={cx("flex transition-opacity duration-500 flex-col opacity-0", classNames.container(), containerClass)}>
      <div className=" flex items-start gap-2.5">
        {!__userIsMe && (
          <img
            className="size-8 rounded-full object-cover"
            src={avatarSrc}
            alt={`${name}'s avatar`}
            data-user-id={userId}
          />
        )}
        <div className="flex flex-col">
          <div
            className={cx(
              "leading-1.5 flex w-full max-w-[260px] flex-col rounded-e-xl rounded-es-xl px-4 py-1 transition-all",
              classNames.bubble(),
              classNames.bubbleIsActive(),
            )}
            onClick={() => setActiveMessage(__isActive ? "" : messageId)}
            data-message-id={messageId}
          >
            {!__userIsMe && (
              <div className="flex items-center space-x-2 pt-2 rtl:space-x-reverse">
                <span
                  className={cx(
                    "text-sm font-semibold text-gray-900 dark:text-white",
                  )}
                >
                  {name}
                </span>
              </div>
            )}
            <p
              className={cx(
                "py-2.5 text-sm font-normal text-gray-900 dark:text-white",
                classNames.meText(),
              )}
            >
              {text}
            </p>
            {/* <span
            className={cx(
              "text-sm font-normal text-gray-500 dark:text-gray-400",
              classNames.meText(),
            )}
          >
            {status}
          </span> */}
          </div>
          <span
            className={cx(
              "text-xs font-normal text-gray-500 transition-all dark:text-gray-400",
              classNames.time(),
              classNames.meTime(),
            )}
          >
            {time}
          </span>

          {/* Message reactions */}
          <MessageReactions
            messageId={messageId}
            reactions={reactions}
            toggleReaction={toggleReaction}
            isUserMessage={!!__userIsMe}
          />
        </div>
        {/* <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle={`dropdownDots-${messageId}`}
        data-dropdown-placement="bottom-start"
        className="inline-flex items-center self-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-600"
        type="button"
      >
        <svg
          className="h-4 w-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button> */}
        {/* <div
        id={`dropdownDots-${messageId}`}
        className="z-10 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Reply
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Report
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Delete
            </a>
          </li>
        </ul>
      </div> */}
      </div>
    </div>
  );
}

export default ChatBubble;
