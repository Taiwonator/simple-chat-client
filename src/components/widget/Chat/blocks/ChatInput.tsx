import nid from "nid";
import cx from "classnames";
import { AddMessage } from "../../../../types";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../../context/UserContext";
import { initFlowbite } from "flowbite";

interface Props {
  addMessage: AddMessage;
}

// user.isTyping = true
// after 3 seconds of inactivity, user.isTyping = false

// create a room
/* room.usersTyping = { [userId]: boolean } */
// get userById to get avatar

function ChatInput({ addMessage }: Props) {
  const [value, setValue] = useState("");
  const { user, logout } = useContext(UserContext);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [isTypingAgent, setIsTypingAgent] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  const sendMessage = () => {
    if (isAgentMode) {
      alert("Agent request: " + value);
      setValue("");
      setIsAgentMode(false);
      return;
    }

    if (value && user) {
      addMessage({
        id: nid(20),
        text: value,
        timestamp: new Date().toISOString(),
        status: "Sent",
        userId: user.id,
        __user: user,
        __isFirstOfTheDay: false,
      });
      setValue("");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const targetValue = e.target.value;
    setValue(targetValue);

    if (targetValue && targetValue?.[0] == "@" && '@agent'.includes(targetValue) && !isAgentMode) {
      setIsTypingAgent(true);
    } else {
      setIsTypingAgent(false);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

    // When value is empty and backspce is clicked, should disable agent mode if agent mode is true
    if (e.key === "Backspace" && value === "" && isAgentMode) {
      setIsAgentMode(false);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // Agent mode
      if (value === "@agent" && !isAgentMode) {
        setIsAgentMode(true);
        setIsTypingAgent(false);
        setValue("");
        return;
      }

      // Default behaviour 
      sendMessage();
    }
  };

  const classNames = {
    sendButton: () => {
      if (!value) return "text-gray-300 dark:text-gray-600";
      return "text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600 cursor-pointer";
    },
  };

  return (
    <>
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="sticky bottom-0 flex items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
        <button
          type="button"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-[red] hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={(e) => logout(e)}
        >
          <svg className="size-5 -scale-x-100" fill="currentColor" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56 56" xmlSpace="preserve">
            <g stroke="black" strokeWidth="2">
              <path stroke="currentColor" d="M54.424,28.382c0.101-0.244,0.101-0.519,0-0.764c-0.051-0.123-0.125-0.234-0.217-0.327L42.208,15.293
              c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L51.087,27H20.501c-0.552,0-1,0.447-1,1s0.448,1,1,1h30.586L40.794,39.293
              c-0.391,0.391-0.391,1.023,0,1.414C40.989,40.902,41.245,41,41.501,41s0.512-0.098,0.707-0.293l11.999-11.999
              C54.299,28.616,54.373,28.505,54.424,28.382z"/>
              <path stroke="currentColor" d="M36.501,33c-0.552,0-1,0.447-1,1v20h-32V2h32v20c0,0.553,0.448,1,1,1s1-0.447,1-1V1c0-0.553-0.448-1-1-1h-34
              c-0.552,0-1,0.447-1,1v54c0,0.553,0.448,1,1,1h34c0.552,0,1-0.447,1-1V34C37.501,33.447,37.053,33,36.501,33z"/>
            </g>
          </svg>
          <span className="sr-only">Disconnect</span>
        </button>
        <button
          className="shrink-0 p-2"
          data-tooltip-target="tooltip-default"
        >
          <img
            src={user?.avatar?.src}
            alt="Avatar"
            className="size-8 rounded-full"
          />
          <span className="sr-only">My Avatar</span>
        </button>
        <div id="tooltip-default" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-green-400 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
          {user?.name}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div className={cx(
          "chat-input-wrapper",
          isAgentMode && "agent-mode",
          isTypingAgent && "agent-typing",
        )}>
          <textarea
            id="chat"
            rows={1}
            className="ml-1 mr-2 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Your message..."
            value={value}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onKeyPress(e)}
          />
        </div>
        <button
          className={cx(
            "inline-flex justify-center rounded-full p-2 transition-all",
            classNames.sendButton(),
          )}
          onClick={() => sendMessage()}
        >
          <svg
            className="size-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </>
  );
}

export default ChatInput;
